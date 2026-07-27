import { useState } from 'react'
import './App.css'

function App() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState([])

  const platformRules = {
    'Twitter/X': 280,
    Instagram: 22000,
    LinkedIn: 3000,
    Facebook: 5000,
  }

  const platforms = Object.keys(platformRules)

  const handlePlatformChange = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(
        selectedPlatforms.filter((item) => item !== platform)
      )
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const isPostValid =
    content.trim().length > 0 &&
    selectedPlatforms.length > 0 &&
    selectedPlatforms.every(
      (platform) => content.length <= platformRules[platform]
    )

  const handlePublish = () => {
    if (isPostValid) {
      alert('Post published successfully!')
    }
  }

  const handleReset = () => {
    setContent('')
    setSelectedPlatforms([])
  }

  return (
    <div className="page">
      <main className="composer">
        <header className="composer-header">
          <div className="logo">P</div>

          <div>
            <h1>Multi-Platform Post Composer</h1>
            <p>
              Create one post and validate it across multiple social platforms.
            </p>
          </div>
        </header>

        <section className="section">
          <div className="section-heading">
            <span className="step-number">1</span>
            <div>
              <h2>Select Platforms</h2>
              <p>Choose where you want to publish your content.</p>
            </div>
          </div>

          <div className="platforms">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform)

              return (
                <label
                  key={platform}
                  className={`platform-option ${
                    isSelected ? 'selected' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handlePlatformChange(platform)}
                  />

                  <span>{platform}</span>

                  {isSelected && (
                    <span className="checkmark">✓</span>
                  )}
                </label>
              )
            })}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <span className="step-number">2</span>
            <div>
              <h2>Write Your Post</h2>
              <p>Enter the content you want to publish.</p>
            </div>
          </div>

          <div className="editor">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />

            <div className="character-counter">
              {content.length} characters
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <span className="step-number">3</span>
            <div>
              <h2>Platform Validation</h2>
              <p>Review platform-specific content limits.</p>
            </div>
          </div>

          {selectedPlatforms.length === 0 ? (
            <div className="empty-state">
              Select at least one platform to view validation results.
            </div>
          ) : (
            <div className="validation-list">
              {selectedPlatforms.map((platform) => {
                const limit = platformRules[platform]
                const isValid = content.length <= limit

                const percentage = Math.min(
                  (content.length / limit) * 100,
                  100
                )

                return (
                  <div
                    key={platform}
                    className={`validation-card ${
                      isValid ? 'valid' : 'invalid'
                    }`}
                  >
                    <div className="validation-top">
                      <div>
                        <strong>{platform}</strong>
                        <p>
                          {content.length} of {limit} characters
                        </p>
                      </div>

                      <span
                        className={`status ${
                          isValid ? 'status-valid' : 'status-invalid'
                        }`}
                      >
                        {isValid ? '✓ Ready' : '✕ Limit Exceeded'}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-bar ${
                          isValid ? '' : 'progress-error'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    {!isValid && (
                      <p className="error-message">
                        Reduce your post by{' '}
                        {content.length - limit} characters.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <footer className="actions">
          <button
            className="reset-button"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            className="publish-button"
            onClick={handlePublish}
            disabled={!isPostValid}
          >
            Publish Post
          </button>
        </footer>
      </main>
    </div>
  )
}

export default App