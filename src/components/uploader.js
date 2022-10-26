import React, {useState} from "react"
import ProgressBar from "./progress-bar";
import spinner from "../images/spinner.gif";
import axios from "axios";

const Uploader = props => {

    const [progress, setProgress] = useState(0);
    const [showInput, setShowInput] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const onFileChange = () => {
        setShowInput(false);
        document.getElementById('submit_button').click();
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        const file = document.querySelector('#file_uploader');

        formData.append("file", file.files[0]);
        formData.append('client_id', props.clientId);
        formData.append("signed_url",true);
        setShowProgressBar(true);
        if (progress >= 100) {
            setProgress(0);
        }
        setTimeout(()=>{}, 500)
        axios.post('https://api.hrbotfactory.com/api/public/file_upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const progress = (progressEvent.loaded / progressEvent.total) * 100;
                setProgress(progress);
                if (progress >= 100) {
                    setShowProgressBar(false);
                    setShowSpinner(true);
                }
            },
            onDownloadProgress: (progressEvent) => {
                if (progressEvent.total === 0) {
                    setShowSpinner(false);
                }
            },
        }).then(r => {
            props.popupClose(props.uploadType, r.data['absolute_path']);
            setShowInput(true);
            setProgress(0);
        }).catch(e => console.log(e));
    };

    return (
        <div>
            <form id="upload_file_form" onSubmit={handleSubmit}>
                <input type="file" name="file_uploader" id="file_uploader" onChange={onFileChange}/>
                <label className="upload_button" style={{display: !showInput ? "none" : "block", backgroundColor: props.popUpTheme}}  for="file_uploader">
                    {'Selecciona un archivo'}
                </label>
                <div hidden={!showProgressBar}>
                    <p>{'Procesando archivo'}</p>
                    <ProgressBar bgcolor={props.popUpTheme} completed={progress > 100 ? 100 : progress.toFixed(2)}/>
                </div>
                <div className="uploaded_loading" style={{display: showSpinner ? "flex" : "none"}}>
                    <img src={spinner} alt={"cargando"} className="loading_spinner"/>
                    <p>{'Subiendo archivo, no cierre la pestaña, dependiendo del tamaño del archivo puede tardar hasta 2 min.'}</p>
                </div>
                <button id="submit_button" type="submit">Upload</button>
            </form>
        </div>
    )
}

export default Uploader