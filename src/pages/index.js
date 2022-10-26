import React, { useState, useEffect } from "react"
import "../components/layout.css"
import Iframe from "react-iframe"
import Seo from "../components/seo"
import axios from "axios"
import SelectPopup from "../components/SelectPopup"
import Select from "react-select"
import { certificados, devops, security } from "../utils/options"
import * as queryString from "query-string"
import Layout from "../components/layout"
import Uploader from "../components/uploader";
import PopupContainer from "../components/popupContainer";

const WePage = ({ location }) => {
  const { sid } = queryString.parse(location.search)

  const isBrowser = typeof window !== "undefined"
  let lsSession =
    isBrowser && localStorage.getItem("session")
      ? localStorage.getItem("session")
      : null

  const name = "Developer"
  const feedback = "No"

  const popUpTheme = '#011665';
  const [sel, setSel] = useState([])
  const [selectInput, setSelectInput] = useState("")
  const [visibility, setVisibility] = useState(false)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState("no sesion");


  const [ uploadType, setUploadType ] = useState("");
  const [ clientId, setClientId ] = useState("");
  const [ uploadContainerVisibility, setUploadContainerVisibility ] = useState(false);
  const [ modalUploaderTitle, setModalUploaderTitle ] = useState('Sube tu archivo');

  const headers = {
    Authorization: "bearer 40b3ff5fdeaf4ca6851eecadd6eec23c",
  }

  useEffect(() => {
    if (sid) {
      setSession(sid)
      setLoading(false)
    } else if (lsSession) {
      setSession(lsSession)
      setLoading(false)
    } else {
      getBotId()
    }

    eventSubscribe()
  }, [])

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
      localStorage.setItem("session", someSession)

      const updateSession = await axios({
        method: "post", //you can set what request you want to be
        url: "https://api.33bot.io/v1/conversation/update",
        data: {
          session_id: someSession,
          global_vars: {
            candidatura_seleccionada: {
              text: name,
              value: name,
            },
            feedback: {
              text: feedback,
              value: feedback,
            },
            bot_url: {
              text: `${location.origin}${location.pathname}?sid=${someSession}`,
              value: `${location.origin}${location.pathname}?sid=${someSession}`,
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

  let popupCloseHandler = async () => {
    await updateData()
    //setSel([])
    setVisibility(false)
    //  console.log(sel)
  }

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
            case "openSelect2":
              //setSel([])
              setSelectInput("cert multi")
              setVisibility(true)
              break
            case "openSelect3":
              setSelectInput("devops")
              setVisibility(true)
              break
            case "openSelect4":
              setSelectInput("security")
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

  //window.parent.postMessage( {event: "openSelect1"}, '*');

  return (
    <>
      <Layout>
          <Seo title="Join Modern Talent Hub" />
          <div style={{ width: "100vw", height: "100vh" }}>
            {loading ? (
              <div className="loader">Cargando...</div>
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
                  ? "Select a certificate program"
                  : selectInput === "cert multi"
                  ? "What other certificates do you have"
                  : selectInput === "devops"
                  ? "Select your DevOps Stack"
                  : "selecione suas ferramentas"
              }
            >
              {selectInput === "cert single" ? (
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
              ) : selectInput === "cert multi" ? (
                <Select
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  value={sel}
                  name="certificados"
                  options={certificados}
                  onChange={changeHandler}
                />
              ) : selectInput === "devops" ? (
                <Select
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={false}
                  name="devops"
                  value={sel}
                  options={devops}
                  onChange={changeHandler}
                />
              ) : (
                <Select
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={false}
                  name="security"
                  value={sel}
                  options={security}
                  onChange={changeHandler}
                />
              )}
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
        </Layout>
    </>
  )
}

export default WePage
