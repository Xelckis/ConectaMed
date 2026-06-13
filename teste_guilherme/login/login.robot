*** Settings ***
Library    SeleniumLibrary

Suite Setup       Open Browser To Login Page
Suite Teardown    Close Browser

*** Variables ***
${URL}        http://localhost:5173/login
${BROWSER}    chrome

*** Test Cases ***

CT01 - Login válido
    Input Text    xpath=//input[@type='email']    admin@teste.com
    Input Text    xpath=//input[@type='password']    123456
    Click Button  xpath=//button[contains(text(),'Entrar')]
    Sleep         2s

CT02 - Email vazio
    Input Text    xpath=//input[@type='password']    123456
    Click Button  xpath=//button[contains(text(),'Entrar')]
    Sleep         2s

CT03 - Senha vazia
    Input Text    xpath=//input[@type='email']    admin@teste.com
    Click Button  xpath=//button[contains(text(),'Entrar')]
    Sleep         2s

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window