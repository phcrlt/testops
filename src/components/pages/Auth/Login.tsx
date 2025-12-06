import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, selectAuthLoading, selectAuthError } from '@store/slices/authSlice';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const from = (location.state as any)?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    const result = await dispatch(login({ email, password }) as any);
    
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };
  
  const handleDemoLogin = async () => {
    setEmail('demo@cloud.ru');
    setPassword('demo123');
    const result = await dispatch(login({ email: 'demo@cloud.ru', password: 'demo123' }) as any);
    
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <img 
              src="/assets/logos/cloud-ru-logo.svg" 
              alt="Cloud.ru" 
              className={styles.logoImage}
            />
            <div className={styles.logoText}>
              <span className={styles.logoMain}>TestOps</span>
              <span className={styles.logoSub}>Copilot</span>
            </div>
          </div>
          <h1 className={styles.loginTitle}>Вход в систему</h1>
          <p className={styles.loginSubtitle}>
            Используйте ваши учетные данные для доступа к TestOps Copilot
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.inputLabel}>
              <FiMail className={styles.inputIcon} />
              <span>Email</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="your.email@cloud.ru"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.inputLabel}>
              <FiLock className={styles.inputIcon} />
              <span>Пароль</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formOptions}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              <span>Запомнить меня</span>
            </label>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Забыли пароль?
            </a>
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingText}>Вход...</span>
            ) : (
              <>
                <FiLogIn className={styles.buttonIcon} />
                <span>Войти</span>
              </>
            )}
          </button>
          
          <div className={styles.divider}>
            <span>или</span>
          </div>
          
          <button 
            type="button" 
            className={styles.demoButton}
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            Попробовать демо-версию
          </button>
          
          <div className={styles.registerPrompt}>
            <span>Нет аккаунта?</span>
            <a href="/register" className={styles.registerLink}>
              Запросить доступ
            </a>
          </div>
        </form>
        
        <div className={styles.loginFooter}>
          <p className={styles.footerText}>
            TestOps Copilot использует Cloud.ru Evolution Foundation Model
            для генерации и анализа тестов.
          </p>
          <div className={styles.footerLinks}>
            <a href="/privacy">Конфиденциальность</a>
            <a href="/terms">Условия</a>
            <a href="/help">Помощь</a>
          </div>
        </div>
      </div>
      
      <div className={styles.featuresPanel}>
        <h2 className={styles.featuresTitle}>Возможности TestOps Copilot</h2>
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🤖</div>
            <div className={styles.featureContent}>
              <h3>AI-генерация тестов</h3>
              <p>Автоматическое создание тест-кейсов на основе требований</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>📊</div>
            <div className={styles.featureContent}>
              <h3>Анализ покрытия</h3>
              <p>Визуализация и оптимизация тестового покрытия</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🔧</div>
            <div className={styles.featureContent}>
              <h3>Интеграции</h3>
              <p>Работа с GitLab, Allure TestOps и Cloud.ru API</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>⚡</div>
            <div className={styles.featureContent}>
              <h3>Высокая скорость</h3>
              <p>Генерация тестов менее чем за 5 секунд</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;