# thock & co. - Custom Mechanical Keyboard Portfolio

This is the source code for the thock & co. portfolio website. It's a React-based single-page application built with Vite and styled with Tailwind CSS.

## How to Add a New Keyboard Article

The website is designed to make adding new keyboard build articles as simple as possible. You only need to edit one file.

### Step 1: Open the Articles Data File

Navigate to the `src/data/` directory and open the file named `articles.ts`.

### Step 2: Add a New Article Object

Inside `articles.ts`, you will see an array of objects called `articles`. Each object represents one keyboard article on the "Keyboards" page. To add a new one, copy an existing object and paste it at the **top** of the array.

**Important:** Adding the new article at the beginning of the array ensures it will appear first on the page.

### Step 3: Edit the Content

Modify the fields of the new object you just pasted. Here is a description of each field:

-   `id`: Make this a unique number (e.g., if the last one was 6, make this 7).
-   `slug`: A unique, URL-friendly identifier. Use lowercase letters and hyphens instead of spaces (e.g., `my-new-keyboard`). This will be part of the URL: `https://thockandco.com/keyboards/my-new-keyboard`.
-   `title`: The title of the review (e.g., `review: project titan`).
-   `date`: The date of the build. Use a consistent format like `month day, year` (e.g., `august 5, 2025`).
-   `image`: A URL to the main image for the keyboard. You can use a service like [Imgur](https://imgur.com/) to host your images.
-   `snippet`: A short, one-sentence description that appears on the card.
-   `testimonial`: The client's quote.
-   `specs`: A comma-separated list of the key specs (e.g., `gasket mount, carbon fiber plate, holy pandas`).
-   `fullContent`: The main body of the article. You can use HTML tags like `<p>` for paragraphs.

### Example of a New Article:

```javascript
{
  id: 7, // New unique ID
  slug: 'project-titan',
  title: 'review: project titan',
  date: 'august 1, 2025',
  image: 'https://your-image-url.com/image.jpg',
  snippet: 'A heavyweight champion with a deep, resonant sound profile and a firm, satisfying tactile response.',
  testimonial: 'The best keyboard I have ever owned. The craftsmanship is simply out of this world.',
  specs: 'top mount, brass plate, zealios v2',
  fullContent: `
    <p>This is the full article for Project Titan. We focused on creating a board with a substantial feel and a very pronounced tactile bump.</p>
    <p>The solid brass plate contributes to the unique sound signature and the overall heft of the keyboard.</p>
  `
},
// ... rest of the articles
```

### Step 4: Save the File

Once you've added your new article object and saved the `articles.ts` file, the website will automatically update. The new keyboard will appear on the keyboards page, and its own dedicated article page will be created.

