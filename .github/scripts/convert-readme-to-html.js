const fs = require("fs");
const cheerio = require("cheerio");
const md = require("markdown-it")({
  html: true,
});
const ARTICLES_READ_PATH = "articles";
const ARTICLES_WRITE_PATH = "docs/articles";
const markdownContent = fs.readFileSync("README.md", "utf8");
const MainHtmlTemplate = (htmlContent, isMain = true) => `
        <!DOCTYPE html>
        <html lang="en">
        <script src="./assets/scripts/change-image-color-on-hover.js"></script>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Namada Awesome</title>
            <link rel="stylesheet" href="${
              isMain ? "assets/style/styles.css" : "../assets/style/styles.css"
            }">
            <link rel="icon" type="image/png" sizes="32x32" href="${
              isMain
                ? "./assets/favicon-32x32.png"
                : "../assets/favicon-32x32.png"
            }">
        </head>
        <body>
            <div class="content-container">
                ${htmlContent}
            </div>
        </body>
        </html>
`;

// const htmlContent = md.render(markdownContent);
const generateArticlesHtml = () => {
  const articlesFiles = fs.readdirSync(ARTICLES_READ_PATH);
  articlesFiles.forEach((articleFile) => {
    const articleContent = fs.readFileSync(
      `${ARTICLES_READ_PATH}/${articleFile}`,
      "utf8"
    );
    const htmlContent = md.render(articleContent);
    const htmlTemplate = MainHtmlTemplate(htmlContent, false);
    const $ = cheerio.load(htmlTemplate);
    $("table").each((index, element) => {
      const tableHeaders = [];
      $(element)
        .find("th")
        .each((i, element) => {
          tableHeaders.push($(element).text());
        });
      $(element)
        .find("tr")
        .each((i, element) => {
          $(element)
            .find("td")
            .each((i, element) => {
              $(element).attr("col", tableHeaders[i]);
            });
        });
    });
    fs.writeFileSync(
      `${ARTICLES_WRITE_PATH}/${articleFile.replace(".md", ".html")}`,
      $.html(),
      "utf8"
    );
    console.log("HTML articles file generated successfully.");
  });
};
const generateMainHtml = () => {
  const htmlContent = md.render(markdownContent);
  const html = MainHtmlTemplate(htmlContent);
  const $ = cheerio.load(html);
  // remove this attributes
  $("source").each((index, element) => {
    $(element).removeAttr("srcset");
  });
  // to each td add col attribute with column name
  $("table").each((index, element) => {
    const tableHeaders = [];
    $(element)
      .find("th")
      .each((i, element) => {
        tableHeaders.push($(element).text());
      });
    $(element)
      .find("tr")
      .each((i, element) => {
        $(element)
          .find("td")
          .each((i, element) => {
            $(element).attr("col", tableHeaders[i]);
          });
      });
  });
  $('a[href$=".md"]').each((index, element) => {
    const mdLink = $(element).attr("href");
    const htmlLink = mdLink.replace(".md", ".html");
    $(element).attr("href", htmlLink);
  });
  fs.writeFileSync("docs/index.html", $.html(), "utf8");

  console.log("HTML main file generated successfully.");
};
generateArticlesHtml();
generateMainHtml();

console.log("HTML files generated successfully.");
