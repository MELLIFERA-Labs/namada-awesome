const fs = require('fs');
const md = require('markdown-it')({
    html: true
});

const markdownContent = fs.readFileSync('README.md', 'utf8');
const htmlContent = md.render(markdownContent);

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Namada Awesome</title>
    <link rel="stylesheet" href="./assets/style/styles.css">
</head>
<body>
    <div class="content-container">
        ${htmlContent}
    </div>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlTemplate, 'utf8');
console.log('HTML file generated successfully.');
