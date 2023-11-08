const { parseMarkdownTables } = require("./helper/index.js");
const fs = require("fs");

const readmeContent = fs.readFileSync("./README.md", "utf8");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const DISCORD_MEMBER_COUNT = 'https://discord.com/api/v9/invites/:serverName?with_counts=true&with_expiration=true'
const REDDIT_MEMBER_COUNT = 'https://www.reddit.com/r/:subreddit/about.json'
const lines = readmeContent.split("\n");
const parsedTable = parseMarkdownTables(readmeContent);
const channelLinks = parsedTable.map(tb => {
    if (tb['where?']) {
        return tb['where?'].map((type, index) => {
            return {
                type: type.trim().toLowerCase(),
                link: tb.link[index]
            }
        }).filter(it => it !== null);
    }
}).flat().filter(Boolean)

const prettyFormatNumber = (number) => {
    return number.toLocaleString('en')   
}

const calculateTelegramMembersCount = async (link) => {
    const url = new URL(link)
    const channelName = url.pathname.split('/')[1]
    const apiUrl = `https://api.telegram.org/${TELEGRAM_BOT_TOKEN}/getChatMembersCount?chat_id=@${channelName}`
    const json = await fetch(apiUrl).then(res => res.json())
    return json.result ? prettyFormatNumber(Number(json.result)) : 'Unknown'
}
const calculateDiscordMemberCount = async (link) => {
    const url = new URL(link)
    const serverName = url.pathname.split('/').at(-1)
    const apiUrl = DISCORD_MEMBER_COUNT.replace(':serverName', serverName)
    const json = await fetch(apiUrl).then(res => res.json())
    return json.approximate_member_count ? prettyFormatNumber(Number(json.approximate_member_count)) : 'Unknown'  
}

const calculateRedditMemberCount = async (link) => {
    const url = new URL(link)
    const serverName = url.pathname.split('/').at(-1)
    const apiUrl = REDDIT_MEMBER_COUNT.replace(':subreddit', serverName)
    const res = await fetch(apiUrl, {
        headers: {
            'User-Agent': 'Nodejs/Github-Action'
        }
    });
    console.log(await res.text())
    const json = await res.json()
    return json?.data?.subscribers ? prettyFormatNumber(Number(json.data.subscribers)) : 'Unknown'
}


const calculateMembersOfChannel = async (links) => {
    
    return Promise.all(links.map(async linkObj => {
        if (linkObj.type.trim().toLowerCase() === 'discord') {
            return {
                ...linkObj,
                memberCount: await calculateDiscordMemberCount(linkObj.link)
            }
        }
        if (linkObj.type.trim().toLowerCase() === 'telegram') {
            return {
                ...linkObj,
                memberCount: await calculateTelegramMembersCount(linkObj.link)
            }    
        }
        if (linkObj.type.trim().toLowerCase() === 'reddit') {
            return {
                ...linkObj,
                memberCount: await calculateRedditMemberCount(linkObj.link)
            }   
        }
        return {
            ...linkObj,
            memberCount: 'Unknown'
        }
    }))
}
async function main() {
    const calculatedLinksMembers = await calculateMembersOfChannel(channelLinks)   
    const parsedMarkdown = lines.map(line => {
        const calculatedLinkMembers = calculatedLinksMembers.find(l => line.includes(l.link) && line.includes('members_count'))
        if (calculatedLinkMembers) {
            const newLine = line.replace(/<!--\s*members_count\s*-->\s*`([\s\S]*)`/, `<!--members_count-->\`${calculatedLinkMembers.memberCount}\``)
            return {
                line: newLine,
                ...calculatedLinkMembers,

            }
        }
        return line
    })
    const collectedMarkdown = {
        lines: [],
        channels: []
    }
    let mode = 'line'
    for (const line of parsedMarkdown) {
        if (typeof line === 'object') {
            if (mode === 'line') {
                collectedMarkdown.lines.push({
                    type: 'channels',
                    index: collectedMarkdown.channels.length,
                })
                collectedMarkdown.channels.push([line])
            } else {
                collectedMarkdown.channels[collectedMarkdown.channels.length - 1].push(line)
            } 
            mode = 'object'
        } else {
            collectedMarkdown.lines.push(line)
            mode = 'line'
        }
    }
    collectedMarkdown.channels.forEach((_, index) => {
        collectedMarkdown.channels[index].sort((a, b) => b.memberCount - a.memberCount)
    })

    // create markdown 

    const markdown = []
    for (const line of collectedMarkdown.lines) {
        if (typeof line === 'object') {
            collectedMarkdown[line.type][line.index].forEach((channel) => {
                markdown.push(channel.line)
            })
        } else {
            markdown.push(line)
        }
    }

    fs.writeFileSync("./README.md", markdown.join("\n"), "utf8");
}

main()



