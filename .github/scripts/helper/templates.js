const BaseHtmlTemplate = (htmlContent, isMain = true) => `
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
            ${htmlContent}
        </body>
        </html>
`;

const ArticleHtmlTemplate =  (htmlContent) => BaseHtmlTemplate(`<div class="content-container">${htmlContent}</div>`, false);
const MainHtmlContent = (htmlContent) => `
<div class="header-wrap">
   <div class="header-container">
      <img alt="namada_logo_banner" src="./assets/logo_namada_for_dark_mode.svg" id="banner-logo">      
   </div>
   <div class="main-container-wrapper">
      <div class="main-container">
         <h1>Awesome NAMADA</h1>
         <p><a href="https://github.com/mellifera-labs/namada-awesome">Awesome NAMADA</a> is a list of awesome resources, documents, articles and tools for <a href="https://namada.net">NAMADA</a>.</p>
         <p>Supported by the Сommunity !</p>
      </div>
      <div class="link-container-wrap">
         <div class="link-container">
            <div class="official-links rounded-corner-div">
               <h2>Official links</h2>
               <div>
                  <a onmouseover="changeImage(this)" onmouseout="resetImage(this)" href="https://discord.com/invite/namada" style="text-decoration: none; margin-left: 5px; display: inline-block;">
                     <picture>
                        <source media="(prefers-color-scheme: dark)">
                        <source media="(prefers-color-scheme: light)">
                        <img height="15" width="15" alt="Discord Icon" src="https://cdn.simpleicons.org/discord/black">
                     </picture>
                     Discord
                  </a>
               </div>
               <div>
                  <a onmouseover="changeImage(this)" onmouseout="resetImage(this)" href="https://namada.net/blog" style="text-decoration: none; margin-left: 5px; display: inline-block;">
                     <picture>
                        <source media="(prefers-color-scheme: dark)">
                        <source media="(prefers-color-scheme: light)">
                        <img height="15" width="15" alt="Medium icon" src="./assets/blog-black.svg">
                     </picture>
                     Namada blog
                  </a>
               </div>
               <div>
                  <a onmouseover="changeImage(this)" onmouseout="resetImage(this)" href="https://github.com/anoma/namada" style="text-decoration: none; margin-left: 5px; display: inline-block;">
                     <picture>
                        <source media="(prefers-color-scheme: dark)">
                        <source media="(prefers-color-scheme: light)">
                        <img height="15" width="15" alt="Github icon" src="https://cdn.simpleicons.org/github/black">
                     </picture>
                     Github
                  </a>
               </div>
               <div>
                  <a onmouseover="changeImage(this)" onmouseout="resetImage(this)" href="https://twitter.com/namada" style="text-decoration: none; margin-left: 5px; display: inline-block;">
                     <picture>
                        <source media="(prefers-color-scheme: dark)">
                        <source media="(prefers-color-scheme: light)">
                        <img height="15" width="15" alt="Twitter icon" src="https://cdn.simpleicons.org/x/black">
                     </picture>
                     Twitter (X)
                  </a>
               </div>
               <div>
                <a onmouseover="changeImage(this)" onmouseout="resetImage(this)" href="https://forum.namada.net/" style="text-decoration: none; margin-left: 5px; display: inline-block;">
                  <picture>
                     <source media="(prefers-color-scheme: dark)">
                     <source media="(prefers-color-scheme: light)">
                     <img height="15" width="15" alt="Website icon" src="./assets/forum-black.svg">
                  </picture> Forum
                </a>
              </div>
               <div>
                  <a onmouseover="changeImage(this)" onmouseout="resetImage(this)" href="https://namada.net" style="text-decoration: none; margin-left: 5px; display: inline-block;">
                     <picture>
                        <source media="(prefers-color-scheme: dark)">
                        <source media="(prefers-color-scheme: light)">
                        <img height="15" width="15" alt="Website icon" src="./assets/globe-black.svg">
                     </picture>
                     Website
                  </a>
               </div>
            </div>
            <div class="navigation-link rounded-corner-div">
               <h2>Navigation</h2>
               <div>
                  <div>
                     <a href="#communities">Community</a>
                  </div>
                  <div>
                     <a href="#useful-articles">Useful Articles</a>
                  </div>
                  <div>
                     <a href="#documentation-guides">Documentation / Guides</a>
                  </div>
                  <div>   
                     <a href="#block-explorers">Block explorers</a>
                  </div>
                  <div>
                     <a href="#faucets">Faucets</a>
                  </div>
                   <div>
                     <a href="#services">Services</a>
                  </div>
                  <div>
                     <a href="#monitoring-dashboards">Monitoring Dashboards</a>
                  </div>
                  <div>
                     <a href="#integrations">Integrations</a>
                  </div>
                 
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

<div class="content-container">
    ${htmlContent}
</div>    
`
const MainHtmlTemplate = (html) => {
  return BaseHtmlTemplate(MainHtmlContent(html), true)
};

module.exports = {
  ArticleHtmlTemplate,
  MainHtmlTemplate
}
