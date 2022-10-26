import React, { useState, useEffect } from "react"
import "../../components/layout.css"
import Iframe from "react-iframe"
import Seo from "../../components/seo"
import axios from "axios"
import SelectPopup from "../../components/SelectPopup"
import Select from "react-select"
import { certificados } from "../../utils/options"
import * as queryString from "query-string"
import Uploader from "../../components/uploader";
import PopupContainer from "../../components/popupContainer";

const FeedbackPageUK = ({ location }) => {
  const feedback = "Sí"
  const { name, c } = queryString.parse(location.search)

  const [ sel, setSel ] = useState([]);
  const [ selectInput, setSelectInput ] = useState("");
  const [ visibility, setVisibility ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ session, setSession ] = useState("no sesion");
  const popUpTheme = '#011665';

  const [ uploadType, setUploadType ] = useState("");
  const [ clientId, setClientId ] = useState("");
  const [ uploadContainerVisibility, setUploadContainerVisibility ] = useState(false);
  const [ modalUploaderTitle, setModalUploaderTitle ] = useState('Sube tu archivo');

  const headers = {
    Authorization: "bearer 40b3ff5fdeaf4ca6851eecadd6eec23c",
  }

  useEffect(() => {
    getBotId()
    eventSubscribe()
  }, [])

  let changeHandler = value => {
    if (value[0]) {
      setSel([...value])
    } else {
      setSel([value])
    }
  }

  let closeUploadPopupHandler = () => {
    setUploadContainerVisibility( false );
    replyAsUser("Volver");
  }

  const eventSubscribe = () => {
    window.addEventListener(
        "message",
        function (event) {
          const data = event.data
          if (event.data.event) {
            switch (data.event) {
              case "clearStorage":
                localStorage.removeItem("session")
                break
              case "openSelect1":
                //setSel([])
                setSelectInput("cert single")
                setVisibility(true)
                break
              case "upload":
                setModalUploaderTitle(data.modalUploaderTitle)
                setUploadType(data.variable)
                setClientId(data.client_id)
                setUploadContainerVisibility(true)
                break;
              default:
                console.log(data)
            }
          }
        },
        false
    )
  }

  const getBotId = async () => {
    try {
      const getBotId = await axios({
        method: "get", //you can set what request you want to be
        url:
          "https://api.33bot.io/v1/conversation/chat/629de10bc4432e0009ba31d2/bots",
        headers,
      })
      //const bot_id = getBotId.data[0].id

      const newSession = await axios({
        method: "post", //you can set what request you want to be
        url: "https://api.33bot.io/v1/conversation/create",
        data: {
          bot_id: getBotId.data[0].id,
        },
        headers,
      })

      const someSession = newSession.data.id
      setSession(someSession)

      const updateSession = await axios({
        method: "post", //you can set what request you want to be
        url: "https://api.33bot.io/v1/conversation/update",
        data: {
          session_id: someSession,
          global_vars: {
            nombre: {
              text: name,
              value: name,
            },
            candidatura_seleccionada: {
              text: c,
              value: c,
            },
            feedback: {
              text: feedback,
              value: feedback,
            },
          },
        },
        headers,
      })

      if (updateSession.data.status === "ok") {
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  console.log(`iniciando chatbot con sesión ${session}`)

  let popupCloseHandler = async () => {
    await updateData()
    //setSel([])
    setVisibility(false)
    console.log(sel)
  }

  let replyAsUser = async( message ) => {

    await axios({
      method: "post", //you can set what request you want to be
      url: "https://api.33bot.io/v1/conversation/message/user",
      data: {
        session_id: session,
        text: message,
      },
      headers,
    })
  }

  const updateData = async () => {
    const data = sel.map(sel => sel.value)

    await axios({
      method: "post", //you can set what request you want to be
      url: "https://api.33bot.io/v1/conversation/message/user",
      data: {
        session_id: session,
        payload: data.join(", "),
        text: data.join(", "),
      },
      headers,
    })
    setSel([])
  }

  let uploadPopupCloseHandler = (uploadedType, uploadedPath) => {
    updateUploadData(uploadedType, uploadedPath)
    setUploadContainerVisibility(false)
  }

  const updateUploadData = async (uploadedType, uploadedPath) => {
    let dataVars = {};
    dataVars[uploadedType] = {
      text: uploadedPath,
      value: uploadedPath,
    };

    await axios({
      method: "post", //you can set what request you want to be
      url: "https://api.33bot.io/v1/conversation/update",
      data: {
        session_id: session,
        global_vars: dataVars,
      },
      headers,
    })

    let responseMessage = 'El archivo se ha subido correctamente';

    await axios({
      method: "post", //you can set what request you want to be
      url: "https://api.33bot.io/v1/conversation/message/user",
      data: {
        session_id: session,
        text: responseMessage,
      },
      headers,
    })
  }

  return (
    <>
      <Seo title="Feeback Modern Talent Hub" />

      <div style={{ width: "100vw", height: "100vh" }}>
        {loading ? (
          <p> Cargando... </p>
        ) : (
          <Iframe
            url={`https://chat.33bot.io/629df7a5e3f499000990898e?r=web&close=0&session=${session}`}
            width="100%"
            height="100%"
            allow="camera;microphone"
            frameborder="0"
          />
        )}
        <SelectPopup
          onClose={popupCloseHandler}
          show={visibility}
          selection={sel}
          title={
            selectInput === "cert single"
              ? "Diga-nos a Certificação do seu programa"
              : selectInput === "cert multi"
              ? "Quais outras certificações você tem?"
              : selectInput === "devops"
              ? "Sua Stack Dev/Ops"
              : "selecione suas ferramentas"
          }
        >
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="certificados"
            value={sel}
            options={certificados}
            onChange={changeHandler}
          />
        </SelectPopup>

        <PopupContainer
            onClose={closeUploadPopupHandler}
            show={uploadContainerVisibility}
            title={modalUploaderTitle}
            showButton={false}
        >
          <Uploader
              uploadType={uploadType}
              updateData={updateUploadData}
              popupClose={uploadPopupCloseHandler}
              popUpTheme={popUpTheme}
              clientId={clientId}
          />
        </PopupContainer>

      </div>
    </>
  )
}

export default FeedbackPageUK
