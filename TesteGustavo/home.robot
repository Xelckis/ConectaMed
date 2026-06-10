*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser    http://localhost:5173/    chrome
Suite Teardown    Close Browser

*** Test Cases ***
CT01 - Deve abrir a página inicial do ConectaMed
    Title Should Be    ConectaMed frontend design
    Page Should Contain    ConectaMed
    Page Should Contain    Cuidado compartilhado, saúde conectada

CT02 - Deve mostrar o botão de começar gratuitamente na página inicial
    Element Should Be Visible    xpath=//button[contains(., 'Começar gratuitamente')]

CT03 - Deve mostrar o botão já tenho conta na página inicial
    Element Should Be Visible    xpath=//button[contains(., 'Já tenho conta')]

CT04 - Deve navegar para a tela de login ao clicar em Já tenho conta
    Click Link    Já tenho conta
    Wait Until Page Contains    Entrar na sua conta    timeout=10s
