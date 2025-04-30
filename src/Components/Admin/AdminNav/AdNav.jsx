<aside className="al-sidebar">
  <div className="al-logo">
    <span className="al-logo-text">Admin Panel</span>
  </div>

  <nav className="al-menu">
    <div className="al-menu-section">
      GENERAL
      <ul>
        <li>
          <Link to="/Dashboard" className={location.pathname === '/Dashboard' ? 'active' : ''}>
            <FontAwesomeIcon icon={faTachometerAlt} className="al-menu-icon" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/AdCalendar" className={location.pathname === '/AdCalendar' ? 'active' : ''}>
            <FontAwesomeIcon icon={faBox} className="al-menu-icon" />
            Pick Up Calendar
          </Link>
        </li>
        <li>
          <Link to="/AdCheckReq" className={location.pathname === '/AdCheckReq' ? 'active' : ''}>
            <FontAwesomeIcon icon={faBox} className="al-menu-icon" />
            Check Pick Up Request
          </Link>
        </li>
        <li>
          <Link to="/EmailDisplay" className={location.pathname === '/EmailDisplay' ? 'active' : ''}>
            <FontAwesomeIcon icon={faProductHunt} className="al-menu-icon" />
            Check Emails
          </Link>
        </li>
        <li>
          <Link to="/HandleBOwners" className={location.pathname === '/HandleBOwners' ? 'active' : ''}>
            <FontAwesomeIcon icon={faUsers} className="al-menu-icon" />
            Handle Business Owners
          </Link>
        </li>
        <li>
          <Link to="/admin/reviews" className={location.pathname === '/admin/reviews' ? 'active' : ''}>
            <FontAwesomeIcon icon={faStar} className="al-menu-icon" />
            Review
            <span className="al-badge">02</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/payment" className={location.pathname === '/admin/payment' ? 'active' : ''}>
            <FontAwesomeIcon icon={faCreditCard} className="al-menu-icon" />
            Payment
          </Link>
        </li>
        <li>
          <Link to="/admin/integration" className={location.pathname === '/admin/integration' ? 'active' : ''}>
            <FontAwesomeIcon icon={faLink} className="al-menu-icon" />
            Integration
          </Link>
        </li>
      </ul>
    </div>

    <div className="al-menu-section">
      ACCOUNT
      <ul>
        <li>
          <Link to="/admin/settings" className={location.pathname === '/admin/settings' ? 'active' : ''}>
            <FontAwesomeIcon icon={faCog} className="al-menu-icon" />
            Settings
          </Link>
        </li>
        <li>
          <Link to="/admin/help" className={location.pathname === '/admin/help' ? 'active' : ''}>
            <FontAwesomeIcon icon={faQuestionCircle} className="al-menu-icon" />
            Help
          </Link>
        </li>
        <li>
          <Link to="/admin/manage-users" className={location.pathname === '/admin/manage-users' ? 'active' : ''}>
            <FontAwesomeIcon icon={faUserCog} className="al-menu-icon" />
            Manage Users
          </Link>
        </li>
      </ul>
    </div>
  </nav>

  <div className="al-logout">
    <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
      <FontAwesomeIcon icon={faSignOutAlt} className="al-menu-icon" />
      Logout
    </a>
  </div>
</aside>
