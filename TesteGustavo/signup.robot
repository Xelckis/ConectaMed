*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser    http://localhost:5173/signup    chrome
Suite Teardown    Close Browser

*** Variables ***
${URL}                http://localhost:5173/signup
${BROWSER}            chrome
${INPUT_NAME}         xpath=//input[@placeholder='Maria Silva']
${INPUT_EMAIL}        xpath=//input[@placeholder='seu@email.com']
${INPUT_PASSWORD}      xpath=(//input[@type='password'])[1]
${INPUT_CONFIRM}       xpath=(//input[@type='password'])[2]
${BUTTON_SIGNUP}      xpath=//button[contains(., 'Criar conta')]

*** Test Cases ***
CT-GUSTAVO-03 - Deve exibir erro quando a senha não atende aos requisitos
    Input Text    ${INPUT_NAME}    Gustavo Teste
    Input Text    ${INPUT_EMAIL}    gustavo.teste@example.com
    Input Password    ${INPUT_PASSWORD}    Abc123
    Input Password    ${INPUT_CONFIRM}    Abc123
    Click Button    ${BUTTON_SIGNUP}
    Wait Until Page Contains    A senha não atende aos requisitos mínimos    timeout=10s

CT-GUSTAVO-04 - Deve navegar para a tela de login a partir do cadastro
    Click Link    Já tenho conta
    Wait Until Page Contains    Entrar na sua conta    timeout=10s
