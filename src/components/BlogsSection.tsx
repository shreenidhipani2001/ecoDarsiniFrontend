export default function BlogsSection() {
    const subscribeNewsletter = () => {
        console.log("Subscribed!");
        // your logic here
      };
return (

<>
  {/* Basic page needs
    ============================================ */}
  <title>eMarket - Multipurpose Responsive HTML5 Template</title>
  <meta charSet="utf-8" />
  <meta
    name="keywords"
    content="html5 template, best html5 template, best html template, html5 basic template, multipurpose html5 template, multipurpose html template, creative html templates, creative html5 templates"
  />
  <meta
    name="description"
    content="eMarket is a powerful Multi-purpose HTML5 Template with clean and user friendly design. It is definite a great starter for any eCommerce web project."
  />
  <meta name="author" content="Magentech" />
  <meta name="robots" content="index, follow" />
  {/* Mobile specific metas
    ============================================ */}
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  {/* Favicon
    ============================================ */}
  <link rel="shortcut icon" type="image/png" href="ico/favicon-16x16.png" />
  {/* Libs CSS
    ============================================ */}
  <link rel="stylesheet" href="css/bootstrap/css/bootstrap.min.css" />
  <link href="css/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
  <link
    href="js/datetimepicker/bootstrap-datetimepicker.min.css"
    rel="stylesheet"
  />
  <link href="js/owl-carousel/owl.carousel.css" rel="stylesheet" />
  <link href="css/themecss/lib.css" rel="stylesheet" />
  <link href="js/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
  <link href="js/minicolors/miniColors.css" rel="stylesheet" />
  {/* Theme CSS
    ============================================ */}
  <link href="css/themecss/so_searchpro.css" rel="stylesheet" />
  <link href="css/themecss/so_megamenu.css" rel="stylesheet" />
  <link href="css/themecss/so-categories.css" rel="stylesheet" />
  <link href="css/themecss/so-listing-tabs.css" rel="stylesheet" />
  <link href="css/themecss/so-newletter-popup.css" rel="stylesheet" />
  <link href="css/footer/footer1.css" rel="stylesheet" />
  <link href="css/header/header1.css" rel="stylesheet" />
  <link id="color_scheme" href="css/theme.css" rel="stylesheet" />
  <link href="css/responsive.css" rel="stylesheet" />
  {/* Google web fonts
    ============================================ */}
  <link
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,500i,700"
    rel="stylesheet"
    type="text/css"
  />
  <style
    type="text/css"
    dangerouslySetInnerHTML={{
      __html: "\n         body{font-family:'Roboto', sans-serif}\n    "
    }}
  />
  <div id="wrapper" className="wrapper-fluid banners-effect-5">
    {/* Header Container  */}
    <header id="header" className=" typeheader-1">
      {/* Header Top */}
      <div className="header-top hidden-compact">
        <div className="container">
          <div className="row">
            <div className="header-top-left col-lg-7 col-md-8 col-sm-6 col-xs-4">
              <div className="hidden-sm hidden-xs welcome-msg">
                <b>Welcome to Emarket !</b> ! Wrap new offers / gift every
                single day on Weekends - New Coupon code: Happy2018{" "}
              </div>
              <ul className="top-link list-inline hidden-lg hidden-md">
                <li className="account" id="my_account">
                  <a
                    href="index.html?route=account/account"
                    title="My Account "
                    className="btn-xs dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    {" "}
                    <span className="hidden-xs">My Account </span>{" "}
                    <span className="fa fa-caret-down" />
                  </a>
                  <ul className="dropdown-menu ">
                    <li>
                      <a href="register.html">
                        <i className="fa fa-user" /> Register
                      </a>
                    </li>
                    <li>
                      <a href="login.html">
                        <i className="fa fa-pencil-square-o" /> Login
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="header-top-right collapsed-block col-lg-5 col-md-4 col-sm-6 col-xs-8">
              <ul className="top-link list-inline lang-curr">
                <li className="currency">
                  <div className="btn-group currencies-block">
                    <form
                      action="index.html"
                      method="post"
                      encType="multipart/form-data"
                      id="currency"
                    >
                      <a
                        className="btn btn-link dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <span className="icon icon-credit " /> $ US Dollar{" "}
                        <span className="fa fa-angle-down" />
                      </a>
                      <ul className="dropdown-menu btn-xs">
                        <li>
                          {" "}
                          <a href="#">(€)&nbsp;Euro</a>
                        </li>
                        <li>
                          {" "}
                          <a href="#">(£)&nbsp;Pounds </a>
                        </li>
                        <li>
                          {" "}
                          <a href="#">($)&nbsp;US Dollar </a>
                        </li>
                      </ul>
                    </form>
                  </div>
                </li>
                <li className="language">
                  <div className="btn-group languages-block ">
                    <form
                      action="index.html"
                      method="post"
                      encType="multipart/form-data"
                      id="bt-language"
                    >
                      <a
                        className="btn btn-link dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <img
                          src="image/catalog/flags/gb.png"
                          alt="English"
                          title="English"
                        />
                        <span className="">English</span>
                        <span className="fa fa-angle-down" />
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="index.html">
                            <img
                              className="image_flag"
                              src="image/catalog/flags/gb.png"
                              alt="English"
                              title="English"
                            />{" "}
                            English{" "}
                          </a>
                        </li>
                        <li>
                          {" "}
                          <a href="index.html">
                            {" "}
                            <img
                              className="image_flag"
                              src="image/catalog/flags/ar.png"
                              alt="Arabic"
                              title="Arabic"
                            />{" "}
                            Arabic{" "}
                          </a>{" "}
                        </li>
                      </ul>
                    </form>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* //Header Top */}
      {/* Header center */}
      <div className="header-middle">
        <div className="container">
          <div className="row">
            {/* Logo */}
            <div className="navbar-logo col-lg-2 col-md-2 col-sm-12 col-xs-12">
              <div className="logo">
                <a href="index.html">
                  <img
                    src="image/catalog/logo.png"
                    title="Your Store"
                    alt="Your Store"
                  />
                </a>
              </div>
            </div>
            {/* //end Logo */}
            {/* Main menu */}
            <div className="main-menu col-lg-6 col-md-7 ">
              <div className="responsive so-megamenu megamenu-style-dev">
                <nav className="navbar-default">
                  <div className=" container-megamenu  horizontal open ">
                    <div className="navbar-header">
                      <button
                        type="button"
                        id="show-megamenu"
                        data-toggle="collapse"
                        className="navbar-toggle"
                      >
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                      </button>
                    </div>
                    <div className="megamenu-wrapper">
                      <span id="remove-megamenu" className="fa fa-times" />
                      <div className="megamenu-pattern">
                        <div className="container-mega">
                          <ul
                            className="megamenu"
                            data-transition="slide"
                            data-animationtime={250}
                          >
                            <li className="home hover">
                              <a href="index.html">
                                Home <b className="caret" />
                              </a>
                              <div
                                className="sub-menu"
                                style={{ width: "100%" }}
                              >
                                <div className="content">
                                  <div className="row">
                                    <div className="col-md-3">
                                      <a
                                        href="index.html"
                                        className="image-link"
                                      >
                                        <span className="thumbnail">
                                          <img
                                            className="img-responsive img-border"
                                            src="image/catalog/menu/home-1.jpg"
                                            alt=""
                                          />
                                        </span>
                                        <h3 className="figcaption">
                                          Home page - (Default)
                                        </h3>
                                      </a>
                                    </div>
                                    <div className="col-md-3">
                                      <a
                                        href="home2.html"
                                        className="image-link"
                                      >
                                        <span className="thumbnail">
                                          <img
                                            className="img-responsive img-border"
                                            src="image/catalog/menu/home-2.jpg"
                                            alt=""
                                          />
                                        </span>
                                        <h3 className="figcaption">
                                          Home page - Layout 2
                                        </h3>
                                      </a>
                                    </div>
                                    <div className="col-md-3">
                                      <a
                                        href="home3.html"
                                        className="image-link"
                                      >
                                        <span className="thumbnail">
                                          <img
                                            className="img-responsive img-border"
                                            src="image/catalog/menu/home-3.jpg"
                                            alt=""
                                          />
                                        </span>
                                        <h3 className="figcaption">
                                          Home page - Layout 3
                                        </h3>
                                      </a>
                                    </div>
                                    <div className="col-md-3">
                                      <a
                                        href="home4.html"
                                        className="image-link"
                                      >
                                        <span className="thumbnail">
                                          <img
                                            className="img-responsive img-border"
                                            src="image/catalog/menu/home-4.jpg"
                                            alt=""
                                          />
                                        </span>
                                        <h3 className="figcaption">
                                          Home page - Layout 4
                                        </h3>
                                      </a>
                                    </div>
                                    {/* <div class="col-md-15">
                                                                  <a href="#" class="image-link"> 
                                                                      <span class="thumbnail">
                                                                          <img class="img-responsive img-border" src="image/demo/feature/comming-soon.png" alt="">
                                                                          
                                                                      </span> 
                                                                      <h3 class="figcaption">Comming soon</h3> 
                                                                  </a> 
                                                                  
                                                              </div> */}
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="with-sub-menu hover">
                              <p className="close-menu" />
                              <a href="#" className="clearfix">
                                <strong>Features</strong>
                                <img
                                  className="label-hot"
                                  src="image/catalog/menu/new-icon.png"
                                  alt="icon items"
                                />
                                <b className="caret" />
                              </a>
                              <div
                                className="sub-menu"
                                style={{ width: "100%", right: "auto" }}
                              >
                                <div className="content">
                                  <div className="row">
                                    <div className="col-md-3">
                                      <div className="column">
                                        <a href="#" className="title-submenu">
                                          Listing pages
                                        </a>
                                        <div>
                                          <ul className="row-list">
                                            <li>
                                              <a href="category.html">
                                                Category Page 1{" "}
                                              </a>
                                            </li>
                                            <li>
                                              <a href="category-v2.html">
                                                Category Page 2
                                              </a>
                                            </li>
                                            <li>
                                              <a href="category-v3.html">
                                                Category Page 3
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="column">
                                        <a href="#" className="title-submenu">
                                          Product pages
                                        </a>
                                        <div>
                                          <ul className="row-list">
                                            <li>
                                              <a href="product.html">
                                                Product page 1
                                              </a>
                                            </li>
                                            <li>
                                              <a href="product-v2.html">
                                                Product page 2
                                              </a>
                                            </li>
                                            {/* <li><a href="product-v3.html">Image size - small</a></li> */}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="column">
                                        <a href="#" className="title-submenu">
                                          Shopping pages
                                        </a>
                                        <div>
                                          <ul className="row-list">
                                            <li>
                                              <a href="cart.html">
                                                Shopping Cart Page
                                              </a>
                                            </li>
                                            <li>
                                              <a href="checkout.html">
                                                Checkout Page
                                              </a>
                                            </li>
                                            <li>
                                              <a href="compare.html">
                                                Compare Page
                                              </a>
                                            </li>
                                            <li>
                                              <a href="wishlist.html">
                                                Wishlist Page
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <div className="column">
                                        <a href="#" className="title-submenu">
                                          My Account pages
                                        </a>
                                        <div>
                                          <ul className="row-list">
                                            <li>
                                              <a href="login.html">
                                                Login Page
                                              </a>
                                            </li>
                                            <li>
                                              <a href="register.html">
                                                Register Page
                                              </a>
                                            </li>
                                            <li>
                                              <a href="my-account.html">
                                                My Account
                                              </a>
                                            </li>
                                            <li>
                                              <a href="order-history.html">
                                                Order History
                                              </a>
                                            </li>
                                            <li>
                                              <a href="order-information.html">
                                                Order Information
                                              </a>
                                            </li>
                                            <li>
                                              <a href="return.html">
                                                Product Returns
                                              </a>
                                            </li>
                                            <li>
                                              <a href="gift-voucher.html">
                                                Gift Voucher
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="with-sub-menu hover">
                              <p className="close-menu" />
                              <a href="#" className="clearfix">
                                <strong>Pages</strong>
                                <b className="caret" />
                              </a>
                              <div
                                className="sub-menu"
                                style={{ width: "40%" }}
                              >
                                <div className="content">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <ul className="row-list">
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="faq.html"
                                          >
                                            FAQ
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="sitemap.html"
                                          >
                                            Site Map
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="contact.html"
                                          >
                                            Contact us
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="banner-effect.html"
                                          >
                                            Banner Effect
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="col-md-6">
                                      <ul className="row-list">
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="about-us.html"
                                          >
                                            About Us 1
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="about-us-2.html"
                                          >
                                            About Us 2
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="about-us-3.html"
                                          >
                                            About Us 3
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="subcategory_item"
                                            href="about-us-4.html"
                                          >
                                            About Us 4
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="with-sub-menu hover">
                              <p className="close-menu" />
                              <a href="#" className="clearfix">
                                <strong>Categories</strong>
                                <img
                                  className="label-hot"
                                  src="image/catalog/menu/hot-icon.png"
                                  alt="icon items"
                                />
                                <b className="caret" />
                              </a>
                              <div
                                className="sub-menu"
                                style={{ width: "100%", display: "none" }}
                              >
                                <div className="content">
                                  <div className="row">
                                    <div className="col-sm-12">
                                      <div className="row">
                                        <div className="col-md-3 img img1">
                                          <a href="#">
                                            <img
                                              src="image/catalog/menu/megabanner/image-1.jpg"
                                              alt="banner1"
                                            />
                                          </a>
                                        </div>
                                        <div className="col-md-3 img img2">
                                          <a href="#">
                                            <img
                                              src="image/catalog/menu/megabanner/image-2.jpg"
                                              alt="banner2"
                                            />
                                          </a>
                                        </div>
                                        <div className="col-md-3 img img3">
                                          <a href="#">
                                            <img
                                              src="image/catalog/menu/megabanner/image-3.jpg"
                                              alt="banner3"
                                            />
                                          </a>
                                        </div>
                                        <div className="col-md-3 img img4">
                                          <a href="#">
                                            <img
                                              src="image/catalog/menu/megabanner/image-4.jpg"
                                              alt="banner4"
                                            />
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-md-3">
                                      <a href="#" className="title-submenu">
                                        Automotive
                                      </a>
                                      <div className="row">
                                        <div className="col-md-12 hover-menu">
                                          <div className="menu">
                                            <ul>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Car Alarms and Security
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Car Audio &amp; Speakers
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Gadgets &amp; Auto Parts
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  More Car Accessories
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <a href="#" className="title-submenu">
                                        Funitures
                                      </a>
                                      <div className="row">
                                        <div className="col-md-12 hover-menu">
                                          <div className="menu">
                                            <ul>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Bathroom
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Bedroom
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Decor
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Living room
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <a href="#" className="title-submenu">
                                        Jewelry &amp; Watches
                                      </a>
                                      <div className="row">
                                        <div className="col-md-12 hover-menu">
                                          <div className="menu">
                                            <ul>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Earings
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Wedding Rings
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Men Watches
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-3">
                                      <a href="#" className="title-submenu">
                                        Electronics
                                      </a>
                                      <div className="row">
                                        <div className="col-md-12 hover-menu">
                                          <div className="menu">
                                            <ul>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Computer
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Smartphone
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Tablets
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  className="main-menu"
                                                >
                                                  Monitors
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="">
                              <p className="close-menu" />
                              <a href="#" className="clearfix">
                                <strong>Accessories</strong>
                              </a>
                            </li>
                            <li className="">
                              <p className="close-menu" />
                              <a href="blog-page.html" className="clearfix">
                                <strong>Blog</strong>
                                <span className="label" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
            {/* //end Main menu */}
            <div className="middle-right col-lg-4 col-md-3 col-sm-6 col-xs-8">
              <div className="signin-w  hidden-sm hidden-xs">
                <ul className="signin-link blank">
                  <li className="log login">
                    <i className="fa fa-lock" />{" "}
                    <a className="link-lg" href="login.html">
                      Login{" "}
                    </a>{" "}
                    or <a href="register.html">Register</a>
                  </li>
                </ul>
              </div>
              <div className="telephone hidden-xs hidden-sm hidden-md">
                <ul className="blank">
                  {" "}
                  <li>
                    <a href="#">
                      <i className="fa fa-truck" />
                      track your order
                    </a>
                  </li>{" "}
                  <li>
                    <a href="#">
                      <i className="fa fa-phone-square" />
                      Hotline (+123)4 567 890
                    </a>
                  </li>{" "}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* //Header center */}
      {/* Header Bottom */}
      <div className="header-bottom hidden-compact">
        <div className="container">
          <div className="row">
            <div className="bottom1 menu-vertical col-lg-2 col-md-3 col-sm-3">
              <div className="responsive so-megamenu megamenu-style-dev ">
                <div className="so-vertical-menu ">
                  <nav className="navbar-default">
                    <div className="container-megamenu vertical">
                      <div id="menuHeading">
                        <div className="megamenuToogle-wrapper">
                          <div className="megamenuToogle-pattern">
                            <div className="container">
                              <div>
                                <span />
                                <span />
                                <span />
                              </div>
                              All Categories
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="navbar-header">
                        <button
                          type="button"
                          id="show-verticalmenu"
                          data-toggle="collapse"
                          className="navbar-toggle"
                        >
                          <i className="fa fa-bars" />
                          <span> All Categories </span>
                        </button>
                      </div>
                      <div className="vertical-wrapper">
                        <span
                          id="remove-verticalmenu"
                          className="fa fa-times"
                        />
                        <div className="megamenu-pattern">
                          <div className="container-mega">
                            <ul className="megamenu">
                              <li className="item-vertical  with-sub-menu hover">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico10.png"
                                    alt="icon"
                                  />
                                  <span>Gifts &amp; Toys</span>
                                  <b className="caret" />
                                </a>
                                <div className="sub-menu" data-subwidth={60}>
                                  <div className="content">
                                    <div className="row">
                                      <div className="col-sm-12">
                                        <div className="row">
                                          <div className="col-md-4 static-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Apparel
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Accessories for Tablet
                                                        PC
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Accessories for i Pad
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Accessories for iPhone
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Bags, Holiday Supplies
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Car Alarms and Security
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Car Audio &amp; Speakers
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Cables &amp; Connectors
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Cameras &amp; Photo
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Electronics
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Outdoor &amp; Traveling
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="col-md-4 static-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Camping &amp; Hiking
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">Earings</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Shaving &amp; Hair
                                                        Removal
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Salon &amp; Spa
                                                        Equipment
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Smartphone &amp; Tablets
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Sports &amp; Outdoors
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Bath &amp; Body
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Gadgets &amp; Auto Parts
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="col-md-4 static-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Bags, Holiday Supplies
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a
                                                        href="#"
                                                        onClick={(e) => e.preventDefault()}
                                                        className="cursor-default"
                                                        >
                                                        Battereries &amp;
                                                        Chargers
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a
                                                        href="#"
                                                        onClick={(e) => e.preventDefault()}
                                                        className="cursor-default"
                                                        >
                                                        Bath &amp; Body
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a
                                                       href="#"
                                                       onClick={(e) => e.preventDefault()}
                                                       className="cursor-default"
                                                       >
                                                        Headphones, Headsets
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a
                                                       href="#"
                                                       onClick={(e) => e.preventDefault()}
                                                       className="cursor-default"
                                                       >
                                                        Home Audio
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li className="item-vertical">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico1.png"
                                    alt="icon"
                                  />
                                  <span>Fashion &amp; Accessories</span>
                                </a>
                              </li>
                              <li className="item-vertical  style1 with-sub-menu hover">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <span className="label" />
                                  <img
                                    src="image/catalog/menu/icons/ico9.png"
                                    alt="icon"
                                  />
                                  <span>Electronic</span>
                                  <b className="caret" />
                                </a>
                                <div className="sub-menu" data-subwidth={40}>
                                  <div className="content">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="row">
                                          <div className="col-md-12 static-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Smartphone
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Esdipiscing
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Scanners</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Apple</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Dell</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Scanners</a>
                                                    </li>
                                                  </ul>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Electronics
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Asdipiscing
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Diam sit</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Labore et</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Monitors</a>
                                                    </li>
                                                  </ul>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row banner">
                                          <a href="#">
                                            <img
                                              src="image/catalog/menu/megabanner/vbanner1.jpg"
                                              alt="banner1"
                                            />
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li className="item-vertical with-sub-menu hover">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico7.png"
                                    alt="icon"
                                  />
                                  <span>Health &amp; Beauty</span>
                                  <b className="caret" />
                                </a>
                                <div className="sub-menu" data-subwidth={60}>
                                  <div className="content">
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="row">
                                          <div className="col-md-4 static-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Car Alarms and Security
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Car Audio &amp; Speakers
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Gadgets &amp; Auto Parts
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Gadgets &amp; Auto Parts
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Headphones, Headsets
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    onClick={(e) => e.preventDefault()}
                                                    className="cursor-default"
                                                    >
                                                    Health &amp; Beauty
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">Home Audio</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Helicopters &amp; Parts
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Outdoor &amp; Traveling
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Toys &amp; Hobbies
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="col-md-4 static-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Electronics
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">Earings</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Salon &amp; Spa
                                                        Equipment
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Shaving &amp; Hair
                                                        Removal
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Smartphone &amp; Tablets
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Sports &amp; Outdoors
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Flashlights &amp; Lamps
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Fragrances</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">Fishing</a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        FPV System &amp; Parts
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="col-md-4 static-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    More Car Accessories
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Lighter &amp; Cigar
                                                        Supplies
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Mp3 Players &amp;
                                                        Accessories
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Men Watches
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Mobile Accessories
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Gadgets &amp; Auto Parts
                                                  </a>
                                                  <ul>
                                                    <li>
                                                      <a href="#">
                                                        Gift &amp; Lifestyle
                                                        Gadgets
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Gift for Man
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Gift for Woman
                                                      </a>
                                                    </li>
                                                    <li>
                                                      <a href="#">
                                                        Gift for Woman
                                                      </a>
                                                    </li>
                                                  </ul>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li className="item-vertical css-menu with-sub-menu hover">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico6.png"
                                    alt="icon"
                                  />
                                  <span>Smartphone &amp; Tablets</span>
                                  <b className="caret" />
                                </a>
                                <div className="sub-menu" data-subwidth={20}>
                                  <div className="content">
                                    <div className="row">
                                      <div className="col-sm-12">
                                        <div className="row">
                                          <div className="col-sm-12 hover-menu">
                                            <div className="menu">
                                              <ul>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Headphones, Headsets
                                                  </a>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Home Audio
                                                  </a>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Health &amp; Beauty
                                                  </a>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Helicopters &amp; Parts
                                                  </a>
                                                </li>
                                                <li>
                                                  <a
                                                    href="#"
                                                    className="main-menu"
                                                  >
                                                    Helicopters &amp; Parts
                                                  </a>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li className="item-vertical">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico5.png"
                                    alt="icon"
                                  />
                                  <span>Health &amp; Beauty</span>
                                </a>
                              </li>
                              <li className="item-vertical">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico4.png"
                                    alt="icon"
                                  />
                                  <span>Bathroom</span>
                                </a>
                              </li>
                              <li className="item-vertical">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico3.png"
                                    alt="icon"
                                  />
                                  <span>Metallurgy</span>
                                </a>
                              </li>
                              <li className="item-vertical">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico2.png"
                                    alt="icon"
                                  />
                                  <span>Bedroom</span>
                                </a>
                              </li>
                              <li className="item-vertical">
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico1.png"
                                    alt="icon"
                                  />
                                  <span>Health &amp; Beauty</span>
                                </a>
                              </li>
                              <li
                                className="item-vertical"
                                style={{ display: "none" }}
                              >
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico11.png"
                                    alt="icon"
                                  />
                                  <span>Toys &amp; Hobbies </span>
                                </a>
                              </li>
                              <li
                                className="item-vertical"
                                style={{ display: "none" }}
                              >
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico12.png"
                                    alt="icon"
                                  />
                                  <span>Jewelry &amp; Watches</span>
                                </a>
                              </li>
                              <li
                                className="item-vertical"
                                style={{ display: "none" }}
                              >
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico9.png"
                                    alt="icon"
                                  />
                                  <span>Home &amp; Lights</span>
                                </a>
                              </li>
                              <li
                                className="item-vertical"
                                style={{ display: "none" }}
                              >
                                <p className="close-menu" />
                                <a href="#" className="clearfix">
                                  <img
                                    src="image/catalog/menu/icons/ico6.png"
                                    alt="icon"
                                  />
                                  <span>Metallurgy</span>
                                </a>
                              </li>
                              <li className="loadmore">
                                <i className="fa fa-plus-square-o" />
                                <span className="more-view">
                                  More Categories
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
            {/* Search */}
            <div className="bottom2 col-lg-7 col-md-6 col-sm-6">
              <div className="search-header-w">
                <div className="icon-search hidden-lg hidden-md hidden-sm">
                  <i className="fa fa-search" />
                </div>
                <div
                  id="sosearchpro"
                  className="sosearchpro-wrapper so-search "
                >
                  <form method="GET" action="index.html">
                    <div id="search0" className="search input-group form-group">
                      <div className="select_category filter_type  icon-select hidden-sm hidden-xs">
                        <select className="no-border" name="category_id">
                          <option value={0}>All Categories</option>
                          <option value={78}>Apparel</option>
                          <option value={77}>Cables &amp; Connectors</option>
                          <option value={82}>Cameras &amp; Photo</option>
                          <option value={80}>Flashlights &amp; Lamps</option>
                          <option value={81}>Mobile Accessories</option>
                          <option value={79}>Video Games</option>
                          <option value={20}>Jewelry &amp; Watches</option>
                          <option value={76}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Earings
                          </option>
                          <option value={26}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wedding Rings
                          </option>
                          <option value={27}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Men Watches
                          </option>
                        </select>
                      </div>
                      <input
                        className="autosearch-input form-control"
                        type="text"
                        defaultValue=""
                        size={50}
                        autoComplete="off"
                        placeholder="Keyword here..."
                        name="search"
                      />
                      <span className="input-group-btn">
                        <button
                          type="submit"
                          className="button-search btn btn-primary"
                          name="submit_search"
                        >
                          <i className="fa fa-search" />
                        </button>
                      </span>
                    </div>
                    <input
                      type="hidden"
                      name="route"
                      defaultValue="product/search"
                    />
                  </form>
                </div>
              </div>
            </div>
            {/* //end Search */}
            {/* Secondary menu */}
            <div className="bottom3 col-lg-3 col-md-3 col-sm-3">
              {/*cart*/}
              <div className="shopping_cart">
                <div id="cart" className="btn-shopping-cart">
                  <a
                    data-loading-text="Loading... "
                    className="btn-group top_cart dropdown-toggle"
                    data-toggle="dropdown"
                    aria-expanded="true"
                  >
                    <div className="shopcart">
                      <span className="icon-c">
                        <i className="fa fa-shopping-bag" />
                      </span>
                      <div className="shopcart-inner">
                        <p className="text-shopping-cart">My cart</p>
                        <span className="total-shopping-cart cart-total-full">
                          <span className="items_cart">0</span>
                          <span className="items_cart2"> item(s)</span>
                          <span className="items_carts"> - $0.00 </span>
                        </span>
                      </div>
                    </div>
                  </a>
                  <ul className="dropdown-menu pull-right shoppingcart-box">
                    <li>
                      <p className="text-center empty">
                        Your shopping cart is empty!
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              {/*//cart*/}
              <ul className="wishlist-comp hidden-md hidden-sm hidden-xs">
                <li className="compare hidden-xs">
                  <a href="#" className="top-link-compare" title="Compare ">
                    <i className="fa fa-refresh" />
                  </a>
                </li>
                <li className="wishlist hidden-xs">
                  <a
                    href="#"
                    id="wishlist-total"
                    className="top-link-wishlist"
                    title="Wish List (0) "
                  >
                    <i className="fa fa-heart" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    {/* //Header Container  */}
    {/* Main Container  */}
    <div className="main-container container">
      <ul className="breadcrumb">
        <li>
          <a href="#">
            <i className="fa fa-home" />
          </a>
        </li>
        <li>
          <a href="#">Blog</a>
        </li>
      </ul>
      <div className="row">
        {/*Left Part Start */}
        <aside
          className="col-md-3 col-sm-4 col-xs-12 content-aside left_column "
          id="column-left"
        >
          <div className="module blog-category titleLine">
            <h3 className="modtitle">Blog Category</h3>
            <div className="modcontent">
              <ul className="list-group ">
                <li className="list-group-item">
                  {" "}
                  <a href="blog-page.html" className="group-item active">
                    Our Blog
                  </a>
                </li>
                <li className="list-group-item">
                  <a href="blog-page.html" className="group-item">
                    Demo Category 2
                  </a>
                </li>
                <li className="list-group-item">
                  <a href="blog-page.html" className="group-item">
                    Demo Category 3
                  </a>
                </li>
                <li className="list-group-item">
                  <a href="blog-page.html" className="group-item">
                    Demo Category 4
                  </a>
                </li>
                <li className="list-group-item">
                  <a href="blog-page.html" className="group-item">
                    Demo Category 5
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="module product-simple">
            <h3 className="modtitle">
              <span>Latest products</span>
            </h3>
            <div className="modcontent">
              <div className="extraslider">
                {/* Begin extraslider-inner */}
                <div className="yt-content-slider extraslider-inner">
                  <div className="item ">
                    <div className="product-layout item-inner style1 ">
                      <div className="item-image">
                        <div className="item-img-info">
                          <a href="#" target="_self" title="Mandouille short ">
                            <img
                              src="image/catalog/demo/product/80/8.jpg"
                              alt="Mandouille short"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="item-info">
                        <div className="item-title">
                          <a href="#" target="_self" title="Mandouille short">
                            Mandouille short{" "}
                          </a>
                        </div>
                        <div className="rating">
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                        </div>
                        <div className="content_price price">
                          <span className="price-new product-price">
                            $55.00{" "}
                          </span>
                          &nbsp;&nbsp;
                          <span className="price-old">$76.00 </span>&nbsp;
                        </div>
                      </div>
                      {/* End item-info */}
                      {/* End item-wrap-inner */}
                    </div>
                    {/* End item-wrap */}
                    <div className="product-layout item-inner style1 ">
                      <div className="item-image">
                        <div className="item-img-info">
                          <a href="#" target="_self" title="Xancetta bresao ">
                            <img
                              src="image/catalog/demo/product/80/7.jpg"
                              alt="Xancetta bresao"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="item-info">
                        <div className="item-title">
                          <a href="#" target="_self" title="Xancetta bresao">
                            Xancetta bresao
                          </a>
                        </div>
                        <div className="rating">
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                        </div>
                        <div className="content_price price">
                          <span className="price-new product-price">
                            $80.00{" "}
                          </span>
                          &nbsp;&nbsp;
                          <span className="price-old">$89.00 </span>&nbsp;
                        </div>
                      </div>
                      {/* End item-info */}
                      {/* End item-wrap-inner */}
                    </div>
                    {/* End item-wrap */}
                    <div className="product-layout item-inner style1 ">
                      <div className="item-image">
                        <div className="item-img-info">
                          <a href="#" target="_self" title="Sausage cowbee ">
                            <img
                              src="image/catalog/demo/product/80/6.jpg"
                              alt="Sausage cowbee"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="item-info">
                        <div className="item-title">
                          <a href="#" target="_self" title="Sausage cowbee">
                            Sausage cowbee
                          </a>
                        </div>
                        <div className="rating">
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                        </div>
                        <div className="content_price price">
                          <span className="price product-price">$66.00</span>
                        </div>
                      </div>
                      {/* End item-info */}
                      {/* End item-wrap-inner */}
                    </div>
                    {/* End item-wrap */}
                    <div className="product-layout item-inner style1 ">
                      <div className="item-image">
                        <div className="item-img-info">
                          <a href="#" target="_self" title="Chicken swinesha ">
                            <img
                              src="image/catalog/demo/product/80/5.jpg"
                              alt="Chicken swinesha"
                            />
                          </a>
                        </div>
                      </div>
                      <div className="item-info">
                        <div className="item-title">
                          <a href="#" target="_self" title="Chicken swinesha">
                            Chicken swinesha
                          </a>
                        </div>
                        <div className="rating">
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                          <span className="fa fa-stack">
                            <i className="fa fa-star fa-stack-2x" />
                          </span>
                        </div>
                        <div className="content_price price">
                          <span className="price-new product-price">
                            $45.00{" "}
                          </span>
                          &nbsp;&nbsp;
                          <span className="price-old">$56.00 </span>&nbsp;
                        </div>
                      </div>
                      {/* End item-info */}
                      {/* End item-wrap-inner */}
                    </div>
                    {/* End item-wrap */}
                  </div>
                </div>
                {/*End extraslider-inner */}
              </div>
            </div>
          </div>
          <div className="module banner-left hidden-xs ">
            <div className="banner-sidebar banners">
              <div>
                <a title="Banner Image" href="#">
                  <img
                    src="image/catalog/banners/banner-sidebar.jpg"
                    alt="Banner Image"
                  />
                </a>
              </div>
            </div>
          </div>
        </aside>
        {/*Left Part End */}
        {/*Middle Part Start*/}
        <div id="content" className="col-md-9 col-sm-8">
          <div className="blog-header">
            <h3>Our Blog</h3>
          </div>
          <div className="blog-category clearfix">
            <div className="product-filter product-filter-top filters-panel hidden-sm hidden-xs">
              <div className="row">
                <div className="col-sm-4 view-mode">
                  <div className="list-view ">
                    <button
                      type="button"
                      id="grid-view"
                      className="btn btn-view hidden-sm hidden-xs"
                    >
                      1
                    </button>
                    <button
                      type="button"
                      id="grid-view-2"
                      className="btn btn-view "
                    >
                      2
                    </button>
                    <button
                      type="button"
                      id="grid-view-3"
                      className="btn btn-view hidden-sm hidden-xs "
                    >
                      3
                    </button>
                    <button
                      type="button"
                      id="grid-view-4"
                      className="btn btn-view hidden-sm hidden-xs"
                    >
                      4
                    </button>
                    <button
                      type="button"
                      id="list-view"
                      className="btn btn-view list "
                    >
                      <i className="fa fa-bars" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-listitem row">
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/4.jpg"
                        >
                          <img
                            src="image/catalog/blog/4.jpg"
                            alt="Duis autem vel eum irure sed diam nonumy"
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>04</b> Dec
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">
                            Duis autem vel eum irure sed diam nonumy
                          </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>
                      </div>
                      <p className="article-description">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lore...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/2.jpg"
                        >
                          <img
                            src="image/catalog/blog/2.jpg"
                            alt="Biten demons lector in henderit in vulp"
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>04</b> Dec
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">
                            Biten demons lector in henderit in vulp
                          </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>
                      </div>
                      <p className="article-description">
                        Duis autem vel eum iriure dolor in hendrerit in
                        vulputate velit esse molestie consequat, vel illum
                        dolore eu feugiat nulla facilisis at vero eros et
                        accumsan et iusto odio dignissim qui blandit praesent
                        luptatum zzril delenit augue duis dolore te feugait
                        nulla facilisi. Lorem ipsum dolor sit amet, c...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/7.jpg"
                        >
                          <img
                            src="image/catalog/blog/7.jpg"
                            alt="Duis autem vel eum tempor invidunt ut labore et "
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>15</b> Nov
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">
                            Duis autem vel eum tempor invidunt ut labore et{" "}
                          </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>{" "}
                        <span className="comment_count">
                          <i className="fa fa-comment-o" />
                          <a href="#">0 Comments</a>
                        </span>
                      </div>
                      <p className="article-description">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lore...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/6.jpg"
                        >
                          <img
                            src="image/catalog/blog/6.jpg"
                            alt="enim ad minim veniam  justo duo dolores et ea"
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>15</b> Nov
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">
                            Enim ad minim veniam justo duo dolores et ea
                          </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>{" "}
                        <span className="comment_count">
                          <i className="fa fa-comment-o" />
                          <a href="#">1 Comment</a>
                        </span>
                      </div>
                      <p className="article-description">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lore...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/5.jpg"
                        >
                          <img
                            src="image/catalog/blog/5.jpg"
                            alt="Kire tuma feugiat "
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>15</b> Nov
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">Kire tuma feugiat </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>
                      </div>
                      <p className="article-description">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lore...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/3.jpg"
                        >
                          <img
                            src="image/catalog/blog/3.jpg"
                            alt="Lorem ipsum dolor sit amet"
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>15</b> Nov
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">
                            Lorem ipsum dolor sit amet
                          </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>{" "}
                        <span className="comment_count">
                          <i className="fa fa-comment-o" />
                          <a href="#">0 Comments</a>
                        </span>
                      </div>
                      <p className="article-description">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lore...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/10.jpg"
                        >
                          <img
                            src="image/catalog/blog/10.jpg"
                            alt="Commodo laoreet semper tincidun   sit"
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>15</b> Nov
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">
                            Commodo laoreet semper tincidun sit
                          </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>
                      </div>
                      <p className="article-description">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua. At vero
                        eos et accusam et justo duo dolores et ea rebum. Stet
                        clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lore...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="blog-item col-lg-4 col-md-4 col-sm-6 col-xs-12">
                <div className="blog-item-inner clearfix">
                  <div className="itemBlogImg clearfix">
                    <div className="article-image">
                      <div>
                        <a
                          className="popup-gallery"
                          href="image/catalog/blog/1.jpg"
                        >
                          <img
                            src="image/catalog/blog/1.jpg"
                            alt="Kire tuma demons vel eum iriure dolor"
                          />
                        </a>
                      </div>
                      <div className="article-date">
                        <div className="date">
                          {" "}
                          <span className="article-date">
                            <b>15</b> Nov
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="itemBlogContent clearfix ">
                    <div className="blog-content">
                      <div className="article-title font-title">
                        <h4>
                          <a href="blog-detail.html">
                            Kire tuma demons vel eum iriure dolor
                          </a>
                        </h4>
                      </div>
                      <div className="blog-meta">
                        {" "}
                        <span className="author">
                          <i className="fa fa-user" />
                          <span>Post by </span>Wash upito
                        </span>
                      </div>
                      <p className="article-description">
                        Duis autem vel eum iriure dolor in hendrerit in
                        vulputate velit esse molestie consequat, vel illum
                        dolore eu feugiat nulla facilisis at vero eros et
                        accumsan et iusto odio dignissim qui blandit praesent
                        luptatum zzril delenit augue duis dolore te feugait
                        nulla facilisi. Lorem ipsum dolor sit amet, c...
                      </p>
                      <div className="readmore">
                        {" "}
                        <a
                          className="btn-readmore font-title"
                          href="blog-detail.html"
                        >
                          <i className="fa fa-caret-right" />
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-filter product-filter-bottom filters-panel clearfix">
              <div className="row">
                <div className="col-md-12">
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Middle Part End*/}
    </div>
    {/* //Main Container */}
    {/* Footer Container */}
    <footer className="footer-container typefooter-1">
      {/* Footer Top Container */}
      <section className="footer-top">
        <div className="container ftop">
          <div className="row">
            <div className="col-lg-8 col-md-7 col-sm-12 col-xs-12 ">
              <div className="module newsletter-footer1">
                <div
                  className="newsletter"
                  style={{ width: "100%", backgroundColor: "#fff" }}
                >
                  <div className="title-block">
                    <div className="page-heading font-title">
                      Signup for Newsletter
                    </div>
                    <div className="promotext">
                      We’ll never share your email address with a third-party.{" "}
                    </div>
                  </div>
                  <div className="block_content">
                    <form
                      method="post"
                      id="signup"
                      name="signup"
                      className="form-group form-inline signup send-mail"
                    >
                      <div className="form-group">
                        <div className="input-box">
                          <input
                            type="email"
                            placeholder="Your email address..."
                            defaultValue=""
                            className="form-control"
                            id="txtemail"
                            name="txtemail"
                            size={55}
                          />
                        </div>
                        <div className="subcribe">
                        <button
  className="btn btn-primary btn-default font-title"
  type="button"
  onClick={subscribeNewsletter}
  name="submit"
>
  Subscribe
</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/*/.modcontent*/}
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-5 col-sm-12 col-xs-12 ">
              <ul className="socials">
                <li className="facebook">
                  <a
                    className="_blank"
                    href="https://www.facebook.com/MagenTech"
                    target="_blank"
                  >
                    <i className="fa fa-facebook" />
                    <span>Facebook</span>
                  </a>
                </li>
                <li className="twitter">
                  <a
                    className="_blank"
                    href="https://twitter.com/smartaddons"
                    target="_blank"
                  >
                    <i className="fa fa-twitter" />
                    <span>Twitter</span>
                  </a>
                </li>
                <li className="google_plus">
                  <a
                    className="_blank"
                    href="https://plus.google.com/u/0/+Smartaddons/posts"
                    target="_blank"
                  >
                    <i className="fa fa-google-plus" />
                    <span>Google Plus</span>
                  </a>
                </li>
                <li className="pinterest">
                  <a
                    className="_blank"
                    href="https://www.pinterest.com/smartaddons/"
                    target="_blank"
                  >
                    <i className="fa fa-pinterest" />
                    <span>Pinterest</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* /Footer Top Container */}
      <div className="footer-middle ">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 col-style">
              <div className="infos-footer">
                <a href="#">
                  <img src="image/catalog/logo-footer.png" alt="image" />
                </a>
                <ul className="menu">
                  <li className="adres">
                    San Luis potosí, centro historico, 78000 san luis potosí,
                    SPL, Mexico
                  </li>
                  <li className="phone">(+0214)0 315 215 - (+0214)0 315 215</li>
                  <li className="mail">
                    <a href="mailto:contact@opencartworks.com">
                      contact@opencartworks.com
                    </a>
                  </li>
                  <li className="time">Open time: 8:00AM - 6:00PM</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-4 col-xs-12 col-style">
              <div className="box-information box-footer">
                <div className="module clearfix">
                  <h3 className="modtitle">Information</h3>
                  <div className="modcontent">
                    <ul className="menu">
                      <li>
                        <a href="#">About Us</a>
                      </li>
                      <li>
                        <a href="#">FAQ</a>
                      </li>
                      <li>
                        <a href="#">Warranty And Services</a>
                      </li>
                      <li>
                        <a href="#">Support 24/7 page</a>
                      </li>
                      <li>
                        <a href="#">Product Registration</a>
                      </li>
                      <li>
                        <a href="#">Product Support</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-4 col-xs-12 col-style">
              <div className="box-account box-footer">
                <div className="module clearfix">
                  <h3 className="modtitle">My Account</h3>
                  <div className="modcontent">
                    <ul className="menu">
                      <li>
                        <a href="#">Brands</a>
                      </li>
                      <li>
                        <a href="#">Gift Certificates</a>
                      </li>
                      <li>
                        <a href="#">Affiliates</a>
                      </li>
                      <li>
                        <a href="#">Specials</a>
                      </li>
                      <li>
                        <a href="#">FAQs</a>
                      </li>
                      <li>
                        <a href="#">Custom Link</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-4 col-xs-12 col-style">
              <div className="box-service box-footer">
                <div className="module clearfix">
                  <h3 className="modtitle">Services</h3>
                  <div className="modcontent">
                    <ul className="menu">
                      <li>
                        <a href="#">Contact Us</a>
                      </li>
                      <li>
                        <a href="#">Returns</a>
                      </li>
                      <li>
                        <a href="#">Support</a>
                      </li>
                      <li>
                        <a href="#">Site Map</a>
                      </li>
                      <li>
                        <a href="#">Customer Service</a>
                      </li>
                      <li>
                        <a href="#">Custom Link</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 col-style">
              <div className="module box-footer so-instagram-gallery-ltr">
                <h4 className="modtitle">Instagram Gallery</h4>
                <div className="form-group"></div>
                <div className="modcontent">
                  <div
                    className="so-instagram-gallery button-type2 4"
                    id="instagram17356972741514990310"
                  >
                    <div className="instagram-items-inner instagram00-5 instagram01-4 instagram02-3 instagram03-2 instagram04-1">
                      <div className="instagram-item 0  first-item ">
                        <div className="instagram_users">
                          <div className="img_users">
                            <a
                              title="Emarket"
                              data-href="https://www.instagram.com/p/BWcLaN9DQfW/"
                              className="instagram_gallery_image gallery_image_instagram17356972741514990310"
                              href="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19985119_1789473437940076_2055170824985378816_n.jpg?taken-by=swhotdeal"
                            >
                              <img
                                className="image_users"
                                src="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19985119_1789473437940076_2055170824985378816_n.jpg"
                                title="Emarket"
                                alt="Emarket"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="instagram-item 1 ">
                        <div className="instagram_users">
                          <div className="img_users">
                            <a
                              title="Emarket"
                              data-href="https://www.instagram.com/p/BWcLY9XDLRu/"
                              className="instagram_gallery_image gallery_image_instagram17356972741514990310"
                              href="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19955766_152435575317196_2812535432292597760_n.jpg?taken-by=swhotdeal"
                            >
                              <img
                                className="image_users"
                                src="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19955766_152435575317196_2812535432292597760_n.jpg"
                                title="Emarket"
                                alt="Emarket"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="instagram-item 2 ">
                        <div className="instagram_users">
                          <div className="img_users">
                            <a
                              title="Emarket"
                              data-href="https://www.instagram.com/p/BWcLT-rD17U/"
                              className="instagram_gallery_image gallery_image_instagram17356972741514990310"
                              href="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19933192_2345189812372940_1937990403319922688_n.jpg?taken-by=swhotdeal"
                            >
                              <img
                                className="image_users"
                                src="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19933192_2345189812372940_1937990403319922688_n.jpg"
                                title="Emarket"
                                alt="Emarket"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="instagram-item 3 ">
                        <div className="instagram_users">
                          <div className="img_users">
                            <a
                              title="Emarket"
                              data-href="https://www.instagram.com/p/BWcLS_vjGhx/"
                              className="instagram_gallery_image gallery_image_instagram17356972741514990310"
                              href="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19984602_1912942795641671_1075249881506906112_n.jpg?taken-by=swhotdeal"
                            >
                              <img
                                className="image_users"
                                src="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19984602_1912942795641671_1075249881506906112_n.jpg"
                                title="Emarket"
                                alt="Emarket"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="instagram-item 4 ">
                        <div className="instagram_users">
                          <div className="img_users">
                            <a
                              title="Emarket"
                              data-href="https://www.instagram.com/p/BWcLSNnDpJp/"
                              className="instagram_gallery_image gallery_image_instagram17356972741514990310"
                              href="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19985191_1485570878166875_6297995079118225408_n.jpg?taken-by=swhotdeal"
                            >
                              <img
                                className="image_users"
                                src="https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/19985191_1485570878166875_6297995079118225408_n.jpg"
                                title="Emarket"
                                alt="Emarket"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*/.instagram-items-inner*/}
                  </div>
                </div>
                {/* /.modcontent*/}
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 col-style">
              <ul className="footer-links font-title">
                <li>
                  <a href="#">Online Shopping</a>
                </li>
                <li>
                  <a href="#">Promotions</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Site Map</a>
                </li>
                <li>
                  <a href="#">Orders and Returns</a>
                </li>
                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
                <li>
                  <a href="#">Most Populars</a>
                </li>
                <li>
                  <a href="#">New Arrivals</a>
                </li>
                <li>
                  <a href="#">Special Products</a>
                </li>
                <li>
                  <a href="#">Manufacturers</a>
                </li>
                <li>
                  <a href="#">Shipping</a>
                </li>
                <li>
                  <a href="#">Payments</a>
                </li>
                <li>
                  <a href="#">Returns</a>
                </li>
                <li>
                  <a href="#">Refunds</a>
                </li>
                <li>
                  <a href="#">Warantee</a>
                </li>
                <li>
                  <a href="#">Promotions</a>
                </li>
                <li>
                  <a href="#">Customer Service</a>
                </li>
                <li>
                  <a href="#">Our Stores</a>
                </li>
                <li>
                  <a href="#">Discount</a>
                </li>
                <li>
                  <a href="#">Checkout</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-12 col-xs-12 text-center">
              <img
                src="image/catalog/demo/payment/payment.png"
                alt="imgpayment"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Footer Bottom Container */}
      <div className="footer-bottom ">
        <div className="container">
          <div className="copyright">
            eMarket © 2018 Demo Store. All Rights Reserved. Designed by{" "}
            <a href="http://www.opencartworks.com/" target="_blank">
              OpenCartWorks.Com
            </a>
          </div>
        </div>
      </div>
      {/* /Footer Bottom Container */}
      {/*Back To Top*/}
      <div className="back-to-top">
        <i className="fa fa-angle-up" />
      </div>
    </footer>
    {/* //end Footer Container */}
  </div>
  {/* Include Libs & Plugins
	============================================ */}
  {/* Placed at the end of the document so the pages load faster */}
  {/* Theme files
	============================================ */}
</>


);

}
