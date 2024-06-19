// markdown-renderer.js

// Function to fetch and render Markdown file
function renderMarkdown(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(markdown => {
            const html = convertMarkdownToHtml(markdown);
            document.getElementById('markdown-container').innerHTML = html;
        })
        .catch(error => console.error('Error fetching Markdown:', error));
}


function convertMarkdownToHtml(markdown) {
    // Convert headers
    markdown = markdown.replace(/(#+)(.*)/g, (match, p1, p2) => {
        const level = p1.length;
        return `<h${level}>${p2.trim()}</h${level}>`;
    });

    // Convert bold text
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Convert inline code
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert multi-line code blocks
    markdown = markdown.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert lists
    markdown = markdown.replace(/^(\s*)[*+-] (.+)/gm, (match, p1, p2) => {
        const indent = p1 ? ' style="padding-left:' + (p1.length * 20) + 'px;"' : '';
        return `<li${indent}>${p2}</li>`;
    });
    markdown = markdown.replace(/<\/li>\n<li/g, '</li><li'); // Fix for list items separated by line breaks

    // Convert line breaks (preserve original line breaks)
    markdown = markdown.replace(/\n/g, '<br>');
    return markdown;
}