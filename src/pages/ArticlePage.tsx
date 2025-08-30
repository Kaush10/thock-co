import { useParams } from 'react-router-dom';
import { articles } from '../data/articles';
import { useEffect } from 'react';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return <div>Article not found</div>;
  }

  // Find additional images matching the article title (excluding the cover)


  return (
    <div className="article-page container mx-auto px-4 py-8 pt-24 text-primary">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-secondary mb-4">{article.date}</p>
      <img src={article.image} alt={article.title} className="w-full h-96 object-cover rounded-lg mb-4" />
      <div className="mb-6 flex items-center">
        <span className="spec-tag">{article.specs}</span>
      </div>
      <div className="prose dark:prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: article.fullContent }} />
      <blockquote className="testimonial-quote mb-8">"{article.testimonial}"</blockquote>
      {article.images && article.images.length > 0 && (
        <div className={`grid gap-4 mt-8 ${article.images.length < 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {article.images.map(img => (
            <img
              key={img}
              src={img}
              alt={article.title}
              className="w-full rounded-lg"
              style={{ display: 'block' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
