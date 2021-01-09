setInterval(setClock, 1000)

const hourHand = document.querySelector('[data-hour-hand]')
const minuteHand = document.querySelector('[data-minute-hand]')
const secondHand = document.querySelector('[data-second-hand]')

const clockText = document.querySelector('.clock_text')

function setClock() {
    const currentDate = new Date()

    const second = currentDate.getSeconds()
    const minute = currentDate.getMinutes()
    const hour = currentDate.getHours()

    const secondsRatio = second / 60
    const minutesRatio = (secondsRatio + minute) / 60
    const hoursRatio = (minutesRatio + hour) / 12

    setRotation(secondHand, secondsRatio)
    setRotation(minuteHand, minutesRatio)
    setRotation(hourHand, hoursRatio)
    "<span style=\"display:inline; color:red\">"
    clockText.innerHTML = `지금은 ${getEmphaticText(hour)}시 ${getEmphaticText(minute)}분 ${getEmphaticText(second)}초 입니다.`;
}

function getEmphaticText(text) {
    return `<span style="display:inline; text-align:right; color:#FF4081">${text}</span>`
}

function setRotation(element, rotationRatio) {
    element.style.setProperty('--rotation', rotationRatio * 360)
}

setClock()