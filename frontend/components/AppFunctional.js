import axios from 'axios'
import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

const initialValues = {
  message: initialMessage,
  email: initialEmail,
  steps: initialSteps,
  index: initialIndex,
}

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [data, setData] = useState(initialValues)

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    let coordinates = []
    switch (data.index) {
      case 0:
        coordinates = [1, 1]
        break
      case 1:
        coordinates = [2, 1]
        break
      case 2:
        coordinates = [3, 1]
        break
      case 3:
        coordinates = [1, 2]
        break
      case 4:
        coordinates = [2, 2]
        break
      case 5:
        coordinates = [3, 2]
        break
      case 6:
        coordinates = [1, 3]
        break
      case 7:
        coordinates = [2, 3]
        break
      case 8:
        coordinates = [3, 3]
    }
    return coordinates
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.

    return `Koordinatlar (${getXY()[0]},${getXY()[1]})`
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setData(initialValues)
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    if (yon == 'left') {
      if (data.index == 0 || data.index == 3 || data.index == 6) {
        setData({
          ...data,
          message: 'Sola gidemezsiniz',
        })
      } else {
        setData({
          ...data,
          index: data.index - 1,
          steps: data.steps + 1,
          message: '',
        })
      }
    } else if (yon == 'up') {
      if (data.index == 0 || data.index == 1 || data.index == 2) {
        setData({
          ...data,
          message: 'Yukarıya gidemezsiniz',
        })
      } else {
        setData({
          ...data,
          index: data.index - 3,
          steps: data.steps + 1,
          message: '',
        })
      }
    } else if (yon == 'right') {
      if (data.index == 2 || data.index == 5 || data.index == 8) {
        setData({
          ...data,
          message: 'Sağa gidemezsiniz',
        })
      } else {
        setData({
          ...data,
          index: data.index + 1,
          steps: data.steps + 1,
          message: '',
        })
      }
    } else if (yon == 'down') {
      if (data.index == 6 || data.index == 7 || data.index == 8) {
        setData({
          ...data,
          message: 'Aşağıya gidemezsiniz',
        })
      } else {
        setData({
          ...data,
          index: data.index + 3,
          steps: data.steps + 1,
          message: '',
        })
      }
    }
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const id = evt.target.id

    sonrakiIndex(id)
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    console.log(evt.target.value)
    setData({ ...data, email: evt.target.value })
  }

  function submitHandler() {
    console.log(getXY()[0], getXY()[1], data.steps, data.email)
    axios
      .post('http://localhost:9000/api/result', {
        x: getXY()[0],
        y: getXY()[1],
        steps: data.steps,
        email: data.email,
      })
      .then(function (response) {
        console.log(response)
        setData({ ...data, message: response.data.message, email: '' })
      })
      .catch(function (error) {
        console.log(error.response.data.message)
        setData({ ...data, message: error.response.data.message, email: '' })
      })
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault()
    submitHandler()
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{data.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === data.index ? ' active' : ''}`}
          >
            {idx === data.index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{data.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => ilerle(event)}>
          SOL
        </button>
        <button id="up" onClick={() => ilerle(event)}>
          YUKARI
        </button>
        <button id="right" onClick={() => ilerle(event)}>
          SAĞ
        </button>
        <button id="down" onClick={() => ilerle(event)}>
          AŞAĞI
        </button>
        <button
          id="reset"
          onClick={() => {
            reset()
          }}
        >
          reset
        </button>
      </div>
      <form onSubmit={() => onSubmit(event)}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={data.email}
          onChange={() => onChange(event)}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
