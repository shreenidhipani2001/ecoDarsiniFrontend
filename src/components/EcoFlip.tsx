import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './ProductFlipBook.css'; // we'll create this next

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category_name: string;
  subcategory_name: string;
  images: { url: string; alt?: string }[];
}

interface Props {
  product: Product;
}

const ProductFlipBook: React.FC<Props> = ({ product }) => {
  const bookRef = useRef<any>(null);

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/500x600?text=Product';

  // Optional: open book on first click anywhere on cover
  const handleCoverClick = () => {
    if (bookRef.current?.pageFlip()) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  return (
    <div className="flipbook-container" onClick={handleCoverClick}>
      <HTMLFlipBook
        ref={bookRef}
        width={420}           // single page width
        height={580}          // single page height
        size="fixed"
        minWidth={300}
        maxWidth={600}
        minHeight={420}
        maxHeight={900}
        drawShadow={true}
        flippingTime={1200}    // smooth flip animation
        usePortrait={true}
        startZIndex={10}
        autoSize={false}
        maxShadowOpacity={0.4}
        showCover={true}       // first & last pages behave like hard covers
        mobileScrollSupport={true}
        useMouseEvents={true}
        swipeDistance={40}
        showPageCorners={true}
        disableFlipByClick={false}
        className="flip-book"
      >
        {/* Page 0 - Cover (right side visible when closed) */}
        <div className="page page-cover">
          <div className="cover-content">
            <h1 className="book-title">Eco Product</h1>
            <p className="book-subtitle">Discover Sustainable Living</p>
            <div className="click-hint">Click to open →</div>
          </div>
        </div>

        {/* Page 1 - Left: Product Image + Title */}
        <div className="page page-product">
          <div className="left-page">
            <h2 className="product-title">{product.name}</h2>
            <img
              src={imageUrl}
              alt={product.name}
              className="product-image"
            />
          </div>
        </div>

        {/* Page 2 - Right: Product Details Card */}
        <div className="page page-details">
          <div className="right-page">
            <div className="details-card">
              <h2 className="card-title">{product.name}</h2>

              <div className="card-section">
                <span className="label">Category:</span>
                <span>{product.category_name} → {product.subcategory_name}</span>
              </div>

              <div className="card-section description">
                <span className="label">Description:</span>
                <p>{product.description}</p>
              </div>

              <div className="card-price">
                <span className="currency">₹</span>
                {parseFloat(product.price).toLocaleString('en-IN')}
              </div>

              <div className="card-stock">
                Stock: <strong>{product.stock}</strong> units
              </div>

              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        </div>

        {/* Optional back cover */}
        <div className="page page-cover page-back">
          <div className="cover-content">
            <h1 className="book-title">Thank You</h1>
            <p className="book-subtitle">For choosing sustainable living</p>
          </div>
        </div>
      </HTMLFlipBook>
    </div>
  );
};

export default ProductFlipBook;