import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNews, selectAllNews, selectNewsLoading, selectNewsError } from '../../store/slices/newsSlice';
import { Calendar, User, ArrowLeft, Share2, Bookmark, Facebook, Twitter, Linkedin, Clock, Eye, Home, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const news = useSelector(selectAllNews);
  const loading = useSelector(selectNewsLoading);
  const error = useSelector(selectNewsError);
  
  const [article, setArticle] = React.useState(null);
  const [relatedArticles, setRelatedArticles] = React.useState([]);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  useEffect(() => {
    dispatch(getNews());
  }, [dispatch]);

  useEffect(() => {
    if (news.length > 0 && id) {
      // Parse the ID to handle both string and number
      const articleId = parseInt(id);
      const foundArticle = news.find(item => item.id === articleId);
      
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Find related articles (same category)
        const related = news
          .filter(item => 
            item.id !== articleId && 
            item.category === foundArticle.category
          )
          .slice(0, 3);
        setRelatedArticles(related);
      }
    }
  }, [news, id]);

  const getImageUrl = (imageData) => {
    if (imageData?.url) {
      return `${STRAPI_URL}${imageData.url}`;
    }
    return 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };

  const shareOnSocialMedia = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        break;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      announcements: 'bg-blue-600',
      events: 'bg-green-600',
      achievements: 'bg-yellow-600',
      academic: 'bg-purple-600',
      sports: 'bg-red-600',
      default: 'bg-primary-600'
    };
    return colors[category] || colors.default;
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      announcements: 'text-blue-600',
      events: 'text-green-600',
      achievements: 'text-yellow-600',
      academic: 'text-purple-600',
      sports: 'text-red-600',
      default: 'text-primary-600'
    };
    return colors[category] || colors.default;
  };

  const getCategoryBgColor = (category) => {
    const colors = {
      announcements: 'bg-blue-50',
      events: 'bg-green-50',
      achievements: 'bg-yellow-50',
      academic: 'bg-purple-50',
      sports: 'bg-red-50',
      default: 'bg-primary-50'
    };
    return colors[category] || colors.default;
  };

  if (loading && !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500 text-2xl">!</div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Article Not Found</h3>
          <p className="text-gray-600 mb-6">
            {error || 'The requested news article could not be found.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <Link
              to="/news"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              View All News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(article.image);
  const readTime = Math.ceil((article.content?.length || 0) / 1000);
  const formattedDate = article.publishDate ? format(new Date(article.publishDate), 'MMMM dd, yyyy') : 'Date not specified';
  const category = article.category || 'News';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary-600 flex items-center transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link to="/news" className="text-gray-600 hover:text-primary-600 transition-colors">News</Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{article.title}</span>
          </div>
        </div>
      </div>

      {/* Main Article */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/news')}
            className="mb-8 flex items-center text-gray-600 hover:text-primary-600 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All News</span>
          </button>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 ${getCategoryColor(category)} text-white text-sm font-semibold rounded-lg shadow-sm`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              <div className="flex flex-wrap items-center gap-3 text-gray-600">
                <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{readTime} min read</span>
                </div>
                <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{article.viewCount || '0'} views</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{article.author || 'School Admin'}</div>
                  <div className="text-sm text-gray-500">Author</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-primary-50 text-primary-600 shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>

          {/* Social Sharing Bar */}
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <span className="font-medium">Share:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => shareOnSocialMedia('facebook')}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                    title="Share on Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => shareOnSocialMedia('twitter')}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-400 hover:text-blue-500"
                    title="Share on Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => shareOnSocialMedia('linkedin')}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-700 hover:text-blue-800"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-700"
                    title="Copy link"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div 
              className="prose prose-lg max-w-none 
                prose-headings:text-gray-900 
                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4
                prose-li:text-gray-700 prose-li:my-1
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-a:font-medium
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />
            
            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-2 ${getCategoryBgColor(category)} ${getCategoryTextColor(category)} rounded-full font-medium`}>
                  {category}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium">
                  School News
                </span>
                <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium">
                  {format(new Date(article.publishDate), 'yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">About the Author</h3>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {article.author || 'School Admin'}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  School administrator and content writer with expertise in educational 
                  communications and community engagement. Dedicated to keeping the 
                  school community informed and connected through timely updates and 
                  engaging content.
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => {
                  const relatedImageUrl = getImageUrl(related.image);
                  const relatedDate = related.publishDate ? format(new Date(related.publishDate), 'MMM dd, yyyy') : '';
                  const relatedCategory = related.category || 'News';
                  
                  return (
                    <Link
                      key={related.id}
                      to={`/news/${related.id}`}
                      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedImageUrl}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 ${getCategoryBgColor(relatedCategory)} ${getCategoryTextColor(relatedCategory)} text-xs font-semibold rounded`}>
                            {relatedCategory}
                          </span>
                          <span className="text-xs text-gray-500">{relatedDate}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2 mb-2 transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {related.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back to News Button */}
          <div className="text-center">
            <Link
              to="/news"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold text-lg group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All News</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;