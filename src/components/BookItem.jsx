import { useState } from 'react';
import PropTypes from 'prop-types';

const BookItem = ({ title, description, imageUrl, id }) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionVisible((prev) => !prev);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const descriptionId = id ? `book-description-${id}` : undefined;
  const toggleButtonId = id ? `toggle-button-${id}` : undefined;
  const placeholderImage = 'https://picsum.photos/seed/noimage/150/200';
  const displayImage = imageError || !imageUrl ? placeholderImage : imageUrl;

  return (
    <article 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
      aria-label={`Book: ${title}`}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex-shrink-0 bg-gray-100 flex items-center justify-center p-4 sm:w-48">
          <img
            src={displayImage}
            alt={imageUrl && !imageError ? `Cover of ${title}` : 'Book cover placeholder'}
            onError={handleImageError}
            className="w-32 h-44 object-cover rounded shadow-sm"
            loading="lazy"
          />
        </div>

        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>

          {description && (
            <button
              id={toggleButtonId}
              onClick={toggleDescription}
              aria-expanded={isDescriptionVisible}
              aria-controls={descriptionId}
              className="inline-flex items-center gap-2 px-4 py-2 mb-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <span>{isDescriptionVisible ? 'Hide' : 'Show'} Description</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDescriptionVisible ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}

          {description && (
            <div
              id={descriptionId}
              className={`overflow-hidden transition-all duration-300 ${
                isDescriptionVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
              aria-hidden={!isDescriptionVisible}
            >
              <p className="text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {!description && (
            <p className="text-gray-500 italic text-sm">
              No description available for this book.
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

BookItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BookItem;

