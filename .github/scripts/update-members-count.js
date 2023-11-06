const { parseMarkdownTables } = require("./helper/index.js");
const fs = require("fs");

const readmeContent = fs.readFileSync("./README.md", "utf8");
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
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

const calculateTelegramMembersCount = async (link) => {
    const url = new URL(link)
    const channelName = url.pathname.split('/')[1]
    const apiUrl = `https://api.telegram.org/${TELEGRAM_BOT_TOKEN}/getChatMembersCount?chat_id=@${channelName}`
    const res = await fetch(apiUrl)
    const json = await res.json()
    return json.result
}

const calculateMembersOfChannel = async (links) => {
    
    return Promise.all(links.map(async link => {
        if (link.type.trim().toLowerCase() === 'discord') {
            return {
                ...link,
                memberCount: null
            }
        }
        return {
            ...link,
            memberCount: await calculateTelegramMembersCount(link.link)
        }
    }))
}
async function main() {
    const calculatedLinksMembers = await calculateMembersOfChannel(channelLinks)   
    const parsedMarkdown = lines.map(line => {
        const calculatedLinkMembers = calculatedLinksMembers.find(l => line.includes(l.link) && line.includes('members_count'))
        if (calculatedLinkMembers) {
            const newLine = line.replace(/<!--\s*members_count\s*-->\s*`(\d+)`/, `<!--members_count-->\`${calculatedLinkMembers.memberCount}\``)
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



