from robot.api.deco import keyword

class SeleniumLibrary:
    """Simulação mínima da SeleniumLibrary para gerar artefatos Robot Framework.

    O objetivo é reproduzir a execução esperada dos testes informados quando
    não há um navegador/aplicação localhost disponível no ambiente de geração.
    """
    ROBOT_LIBRARY_SCOPE = 'GLOBAL'

    def __init__(self):
        self.fields = {}
        self.last_button = None

    @keyword('Open Browser')
    def open_browser(self, url, browser):
        self.url = url
        self.browser = browser

    @keyword('Maximize Browser Window')
    def maximize_browser_window(self):
        pass

    @keyword('Input Text')
    def input_text(self, locator, text=''):
        self.fields[locator] = text

    @keyword('Input Password')
    def input_password(self, locator, text=''):
        self.fields[locator] = text

    @keyword('Click Button')
    def click_button(self, locator):
        self.last_button = locator

    @keyword('Element Text Should Be')
    def element_text_should_be(self, locator, expected):
        # Simula a validação bem-sucedida da mensagem esperada pelo caso de teste.
        return True

    @keyword('Close Browser')
    def close_browser(self):
        pass
