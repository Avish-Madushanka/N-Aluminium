import './AluRegVideoUp.css';

export default function AluRegVideoUp() {
  return (
    <div className="AluRegVideoUp-library">
      <div className="AluRegVideoUp-header">
        <div className="AluRegVideoUp-title-section">
          <h1 className="AluRegVideoUp-title">Your VideoPress library</h1>
          <span className="AluRegVideoUp-count">13 Videos</span>
        </div>

        <div className="AluRegVideoUp-search-section1">
          <div className="AluRegVideoUp-search-wrapper1">
            <svg className="AluRegVideoUp-search-icon1" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-0.59 4.23-1.57L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" fill="#666"/>
            </svg>
            <input type="text1" placeholder="Search your library1" className="AluRegVideoUp-search-input1" />
          </div>
          <button className="AluRegVideoUp-filters-btn">Filters</button>
        </div>
      </div>

      <div className="AluRegVideoUp-grid">
        <div className="AluRegVideoUp-card">
          <div className="AluRegVideoUp-thumbnail">
            <span className="AluRegVideoUp-duration">03:38</span>
          </div>
          <p className="AluRegVideoUp-video-title">Acousticlive show at terraces</p>
        </div>

        <div className="AluRegVideoUp-card">
          <div className="AluRegVideoUp-thumbnail">
            <span className="AluRegVideoUp-duration">02:49</span>
          </div>
          <p className="AluRegVideoUp-video-title">Bring it all over videoclip</p>
        </div>

        <div className="AluRegVideoUp-card">
          <div className="AluRegVideoUp-thumbnail">
            <span className="AluRegVideoUp-duration">02:14</span>
          </div>
          <p className="AluRegVideoUp-video-title">Keep moving!</p>
        </div>

        <div className="AluRegVideoUp-card">
          <div className="AluRegVideoUp-thumbnail">
            <span className="AluRegVideoUp-duration">01:24</span>
          </div>
          <p className="AluRegVideoUp-video-title">ADDICT RUE</p>
        </div>

        <div className="AluRegVideoUp-card">
          <div className="AluRegVideoUp-thumbnail">
            <span className="AluRegVideoUp-duration">02:53</span>
          </div>
          <p className="AluRegVideoUp-video-title">Theywon'tcatchme</p>
        </div>

        <div className="AluRegVideoUp-card">
          <div className="AluRegVideoUp-thumbnail">
            <span className="AluRegVideoUp-duration">00:36</span>
          </div>
          <p className="AluRegVideoUp-video-title">Liveperformance</p>
        </div>

        <div className="AluRegVideoUp-card">
          <div className="AluRegVideoUp-thumbnail">
            <span className="AluRegVideoUp-duration">02:14</span>
          </div>
          <p className="AluRegVideoUp-video-title">Fastdancing-videoclipdemo</p>
        </div>
      </div>
    </div>
  )
}