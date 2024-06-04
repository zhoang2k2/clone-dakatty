import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./footer.scss";
import {
  faFacebook,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCopyright,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-wrapper">
        <div className="author">
          <div className="about-author">
            <h2>About us</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id
              aliquet ex. Vivamus at ligula vel justo viverra efficitur nec nec
              nisi. Sed viverra felis in arcu congue, at ultricies felis
              fermentum. Sed placerat nec libero sed lacinia.
            </p>
          </div>

          <div className="author-contact">
            <h2>Contact us via</h2>

            <div className="author-address">
              <i>
                <FontAwesomeIcon icon={faLocationDot} />
              </i>
              Hai Chau, Da Nang
            </div>

            <div className="author-hotline">
              <i>
                <FontAwesomeIcon icon={faPhone} />
              </i>
              +84 905 000 000
            </div>

            <div className="author-email">
              <i>
                <FontAwesomeIcon icon={faEnvelope} />
              </i>
              nvhoang2012002@business.com
            </div>
          </div>

          <div className="author-media">
            <h2>Our social media</h2>
            <div className="media">
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faInstagram} />
              <FontAwesomeIcon icon={faGithub} />
            </div>
          </div>
        </div>

        <div className="copyright">
          <i>
            <FontAwesomeIcon icon={faCopyright} />
          </i>
          <p>2023 - Copyright belongs to ZHoang2K2</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
