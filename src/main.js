let resultElement = document.querySelector('.result')
let mainContainer = document.querySelector('.main-container')
let rowId = 1

// Peticion a la Api de palabras
// Poner condicion para q sean 5 letras

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '8bf0202a12msha7ea922359862bep1551b3jsn716c97bb32a4',
		'X-RapidAPI-Host': '1000-most-common-words.p.rapidapi.com'
	}
};

fetch('https://1000-most-common-words.p.rapidapi.com/words/spanish?words_limit=50', options)
.then(result => result.json())
.finally(()=>{
    let loadingElement = document.querySelector('.loading')
    // loadingElement.innerHTML = ""
    loadingElement.style.display = 'none';
})
.then(data => {

    console.log(data);

    // PROBAR ALGUN METODO QUE CUANDO ENCUENTRE LA CONDICION CORTE EL BUCLE

    const wordFiveLeters = data.find(element => element.length==5)

    console.log(wordFiveLeters);

    let word = wordFiveLeters
    let wordArray = word.toUpperCase().split('')

    let actualRow = document.querySelector('.row')

    drawSquares(actualRow)
    listenInput(actualRow)
    addFocus(actualRow)

    function listenInput (actualRow){
        let squares = actualRow.querySelectorAll('.square');
        squares = [...squares]

        let userInput = []

        squares.forEach(element=>{
            element.addEventListener('input', (e)=>{
                // Si no se ha borrado haga todo
                if(e.inputType != 'deleteContentBackward'){
                    console.log(e.inputType);
                    // Tomar el letra ingresada
                    userInput.push(e.target.value.toUpperCase());
                    console.log(userInput);
                    if(e.target.nextElementSibling){
                        e.target.nextElementSibling.focus()
                    }else{
                        // Crear Array con las letras completas
                        let squaresFilled = document.querySelectorAll('.square')
                        squaresFilled = [...squaresFilled]
                        let lastFiveSquaresFilled = squaresFilled.slice(-(data[0].length))
                        let finalUserInput = []
                        lastFiveSquaresFilled.forEach(e=>{
                            finalUserInput.push(e.value.toUpperCase());
                        })

                        //Cambiar estilo si existe la letra pero no esta en la posicion correcta
                        let existIndexArray = existLetter(wordArray, finalUserInput)
                        console.log(existIndexArray);
                        existIndexArray.forEach((element=>{

                            squares[element].classList.add('gold')
                        }));
                        // Comparar arreglos para cambiar estilos (colores)
                        let rightIndex = compareArrays(wordArray, userInput)
                        console.log(rightIndex);
                        rightIndex.forEach(element => {
                            squares[element].classList.add('green')
                        })
                        // Si los arreglos son iguales
                        if(rightIndex.length == wordArray.length){
                            textMsg='Ganaste!'
                            showResult(textMsg)
                                return
                            }
                            // Crear un linea nueva para palabra
                            let actualRow = createRow()
                            // Para que no tire error cuando intenta realizar las funciones cuando ya pasaron los 5 intentos
                            if(!actualRow){
                                return
                            }
                            drawSquares(actualRow)
                            listenInput(actualRow)
                            addFocus(actualRow)
                    }
                }else{
                    userInput.pop()
                    console.log(userInput);
                }
            })
        })
    }

    // FUNCIONES

    const compareArrays = (array1, array2) =>{
        let iqualsIndex = []
        array1.forEach((elemnt, index)=>{
            if(elemnt == array2[index]){
                console.log(`en la posicion ${index} SI son iguales`);
                iqualsIndex.push(index)
            }else{
                console.log(`en la posicion ${index} NO son iguales`);
            }
        })
        return iqualsIndex
    }

    const existLetter = (array1, array2) => {
        let existIndexArray = []
        array2.forEach((element, index)=>{
        if(array1.includes(element)){
            existIndexArray.push(index)
        }
        })
        return existIndexArray
    }

    const createRow = ()=>{
        rowId++
        if(rowId <= 5){
            let newRow = document.createElement('div')
            newRow.classList.add('row')
            newRow.setAttribute('id', rowId)
            mainContainer.appendChild(newRow)
            return newRow
        }else{
            textMsg=`Intentalo de nuevo, la palabra correcta era "${word.toUpperCase()}"`
            showResult(textMsg)
        }
    }

    function drawSquares (actualRow)  {
        wordArray.forEach((item, index) => {
            if(index===0){
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus">`
            }else{
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square">`
            }
        })
    }

    function addFocus (actualRow) {
        let focusElement = actualRow.querySelector('.focus')
        focusElement.focus();
    }

    function showResult (textMsg){
        resultElement.innerHTML = `
        <p>${textMsg}</p>
        <button class="button">Reiniciar</button>`
        let resetBtn = document.querySelector('.button')
        resetBtn.addEventListener('click', ()=>{
            location.reload()
        })
    }
})



