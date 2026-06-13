*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser To Login
Suite Teardown    Close Browser

*** Variables ***
${URL}        http://localhost:5173/login
${BROWSER}    chrome

*** Test Cases ***
CT01 - Login deve redirecionar para Dashboard
    Dado que o usuário preenche o login corretamente
    Quando ele clicar em entrar
    Então o sistema deve abrir o dashboard

*** Keywords ***
Open Browser To Login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Dado que o usuário preenche o login corretamente
    Input Text    xpath=//input[@type="email"]    teste@teste.com
    Input Text    xpath=//input[@type="password"]    123456

Quando ele clicar em entrar
    Click Button    xpath=//button[contains(., "Entrar")]

Então o sistema deve abrir o dashboard
    Wait Until Page Contains    Meus Pacientes    5s
    Page Should Contain    Meus Pacientes