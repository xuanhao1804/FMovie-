import "./FilmsCard.scss"
import { Button, Modal } from 'antd';
import  { useState } from 'react';
const FilmsCard = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="films-card" style={{ backgroundImage: `url(${"https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/thumbnail/190x260/2e2b8cd282892c71872b9e67d2cb5039/r/s/rsz_exe_main-poster-v2.jpg"})` }}
                onClick={() => setOpen(true)}>
                <span className="films-card-age-limitation">
                    18+
                </span>
                <span className="films-card-rating">
                    8.9 <i style={{ color: "yellow" }} className="fa-solid fa-star"></i>
                </span>
            </div>
            <Modal
                
                centered
                open={open}

                onCancel={() => setOpen(false)}
                width={1054}
            >
               <iframe width="1004" height="565" src="https://www.youtube.com/embed/aFsGDcy-6hc" title="Venom: The Last Dance | Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </Modal>
        </>
    )
}

export default FilmsCard