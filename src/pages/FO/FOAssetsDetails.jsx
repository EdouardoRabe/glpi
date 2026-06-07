import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Asset from "../../backend/model/Asset";

export default function FOAssetsDetails() {
    const { id, itemtype } = useParams();
    const [asset, setAsset] = useState(null);
    const [image, setImage] = useState("");

    useEffect(()=>{
        const load = async ()=>{
            console.log(itemtype, id);
            const as = await Asset.getByIdSimple(itemtype,id);
            const im = await as.getImageUrl();
            setAsset(as);
            setImage(im);
        }
        load();
    },[])

    return (
        <div className="FOAssetsDetails">
            <h1>Détails de l'actif</h1>
            <p>{asset?.name}</p>
            <img src={image} alt="sary" />
        </div>
    );
}