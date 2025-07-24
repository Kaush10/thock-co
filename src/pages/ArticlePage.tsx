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

  return (
    <div className="article-page container mx-auto px-4 py-8 pt-24 text-primary">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-secondary mb-4">{article.date}</p>
      <img src={article.image} alt={article.title} className="w-full h-96 object-cover rounded-lg mb-8" />
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.fullContent }} />
    </div>
  );
};

export default ArticlePage;
