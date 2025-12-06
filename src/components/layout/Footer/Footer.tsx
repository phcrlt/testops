import React from 'react';
import { FiGithub, FiMessageSquare, FiHelpCircle } from 'react-icons/fi';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.footerLogo}>
            <span className={styles.logoText}>TestOps Copilot</span>
            <span className={styles.logoVersion}>v1.0.0-alpha</span>
          </div>
          <p className={styles.footerDescription}>
            AI-ассистент для автоматизации работы QA-инженера на базе Cloud.ru Evolution Foundation Model
          </p>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Ресурсы</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/documentation" className={styles.footerLink}>Документация</a></li>
            <li><a href="/api-docs" className={styles.footerLink}>API Справка</a></li>
            <li><a href="/examples" className={styles.footerLink}>Примеры использования</a></li>
            <li><a href="/changelog" className={styles.footerLink}>История изменений</a></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Поддержка</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/help" className={styles.footerLink}><FiHelpCircle /> Помощь</a></li>
            <li><a href="/feedback" className={styles.footerLink}><FiMessageSquare /> Обратная связь</a></li>
            <li><a href="https://github.com/cloud-ru/testops-copilot" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
              <FiGithub /> GitHub
            </a></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Контакты</h4>
          <ul className={styles.footerContacts}>
            <li>Техподдержка: support@cloud.ru</li>
            <li>Бизнес-вопросы: sales@cloud.ru</li>
            <li>Телефон: +7 (800) 555-35-35</li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          © {currentYear} Cloud.ru. Все права защищены.
        </div>
        <div className={styles.legalLinks}>
          <a href="/privacy" className={styles.legalLink}>Политика конфиденциальности</a>
          <a href="/terms" className={styles.legalLink}>Условия использования</a>
          <a href="/cookies" className={styles.legalLink}>Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;