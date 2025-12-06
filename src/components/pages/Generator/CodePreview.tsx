import React from 'react';
import CodeEditor from '@ui/CodeEditor/CodeEditor';

interface CodePreviewProps {
  code: string;
  language?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code, language = 'python' }) => {
  const exampleCode = code || `import allure
import pytest
from typing import Dict, Any

@allure.feature("calculator-ui")
@allure.label("owner", "qa-team")
@allure.suite("UI Тестирование")
class TestCalculatorUI:
    """Тесты для калькулятора цен Cloud.ru"""
    
    @allure.title("Проверка кнопки 'Добавить сервис'")
    @allure.tag("CRITICAL")
    @allure.label("priority", "P0")
    @allure.story("Основной функционал")
    def test_add_service_button(self, page) -> None:
        """Тест проверяет доступность и функциональность кнопки добавления сервиса"""
        
        with allure.step("Открыть главную страницу калькулятора"):
            page.goto("https://cloud.ru/calculator")
            allure.attach(
                page.screenshot(),
                name="calculator-main-page",
                attachment_type=allure.attachment_type.PNG
            )
        
        with allure.step("Найти кнопку 'Добавить сервис'"):
            add_button = page.locator("button:has-text('Добавить сервис')")
            assert add_button.is_visible(), "Кнопка 'Добавить сервис' не найдена"
            assert add_button.is_enabled(), "Кнопка 'Добавить сервис' не активна"
        
        with allure.step("Кликнуть по кнопке 'Добавить сервис'"):
            add_button.click()
            allure.attach(
                page.screenshot(),
                name="after-add-service-click",
                attachment_type=allure.attachment_type.PNG
            )
        
        with allure.step("Проверить открытие каталога продуктов"):
            catalog = page.locator("[data-testid='product-catalog']")
            assert catalog.is_visible(), "Каталог продуктов не открылся"
            
            product_count = page.locator(".product-card")
            assert product_count.count() > 0, "В каталоге нет продуктов"
    
    @allure.title("Проверка расчета цены при изменении конфигурации Compute")
    @allure.tag("NORMAL")
    @allure.label("priority", "P1")
    @allure.story("Расчет стоимости")
    def test_price_calculation(self, page) -> None:
        """Тест проверяет динамический расчет цены при изменении параметров"""
        
        # Arrange
        with allure.step("Добавить сервис Compute"):
            page.goto("https://cloud.ru/calculator")
            page.click("button:has-text('Добавить сервис')")
            page.click(".product-card:has-text('Compute')")
        
        with allure.step("Запомнить начальную цену"):
            initial_price = page.locator(".total-price").text_content()
            allure.attach(
                f"Начальная цена: {initial_price}",
                name="initial-price",
                attachment_type=allure.attachment_type.TEXT
            )
        
        # Act
        with allure.step("Изменить количество CPU"):
            cpu_slider = page.locator("[data-testid='cpu-slider']")
            cpu_slider.fill("4")
        
        # Assert
        with allure.step("Проверить обновление цены"):
            new_price = page.locator(".total-price").text_content()
            assert new_price != initial_price, "Цена не изменилась после изменения CPU"
            
            allure.attach(
                page.screenshot(),
                name="price-after-cpu-change",
                attachment_type=allure.attachment_type.PNG
            )
        
        with allure.step("Проверить корректность расчета"):
            # Здесь может быть сложная логика проверки
            assert "руб" in new_price, "Цена отображается не в рублях"
            assert "месяц" in new_price, "Не указан период (в месяц)"

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--alluredir=./reports"])`;

  return (
    <CodeEditor
      value={exampleCode}
      language={language}
      readOnly={true}
      height="600px"
      showCopyButton={true}
      showDownloadButton={true}
      filename="generated_tests.py"
    />
  );
};

export default CodePreview;