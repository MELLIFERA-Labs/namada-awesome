const fs = require("fs");
const cheerio = require("cheerio");
const md = require("markdown-it")({
  html: true,
});
const ARTICLES_READ_PATH = "articles";
const ARTICLES_WRITE_PATH = "docs/articles";
const markdownContent = fs.readFileSync("README.md", "utf8");
const { ArticleHtmlTemplate, MainHtmlTemplate } = require('./helper/templates.js');

// const htmlContent = md.render(markdownContent);
const generateArticlesHtml = () => {
  const articlesFiles = fs.readdirSync(ARTICLES_READ_PATH);
  articlesFiles.forEach((articleFile) => {
    const articleContent = fs.readFileSync(
      `${ARTICLES_READ_PATH}/${articleFile}`,
      "utf8"
    );
    const htmlContent = md.render(articleContent);
    const htmlTemplate = ArticleHtmlTemplate(htmlContent);
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
  // console.log(htmlContent)
  const $ = cheerio.load(htmlContent);
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
  // get only README content
  const htmlAfterHr = $('hr').nextAll().map((index, element) => $.html(element)).get().join('');
  const html = MainHtmlTemplate(htmlAfterHr);

  fs.writeFileSync("docs/index.html", html, "utf8");

  console.log("HTML main file generated successfully.");
};
generateArticlesHtml();
generateMainHtml();

console.log("HTML files generated successfully.");
