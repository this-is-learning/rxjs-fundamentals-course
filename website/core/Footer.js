const React = require("react");

class Footer extends React.Component {
  docUrl(doc) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    return `${baseUrl}${docsPart}${doc}`;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Open Learning</h5>
            <a href={this.docUrl("part-1")}>{this.props.config.title}</a>
            <a
              href="https://dev.to/this-is-learning"
              target="_blank"
              rel="noreferrer noopener"
            >
              This is Learning publication
            </a>
            <a
              href="https://dev.to/this-is-angular"
              target="_blank"
              rel="noreferrer noopener"
            >
              This is Angular publication
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="https://discord.gg/ygKzbrBtVn"
              target="_blank"
              rel="noreferrer noopener"
            >
              This is Learning Community Discord
            </a>
            <a href="https://github.com/this-is-learning">
              This is Learning GitHub
            </a>
            <a href="https://github.com/this-is-angular">
              This is Angular GitHub
            </a>
          </div>
          <div>
            <h5>Social</h5>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/this-is-learning/rxjs-fundamentals-course/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
            {this.props.config.twitterUsername && (
              <div className="social">
                <a
                  href={`https://twitter.com/${this.props.config.twitterUsername}`}
                  className="twitter-follow-button"
                >
                  Follow @{this.props.config.twitterUsername}
                </a>
              </div>
            )}
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
