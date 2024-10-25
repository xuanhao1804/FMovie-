import { useSelector } from "react-redux"
import "./PopcornSelection.scss"
import { NumericFormat } from "react-number-format"

const PopcornSelection = ({ selectdPopcorns, setSelectedPopcorns }) => {

    const { popcorns } = useSelector((state) => state)

    const handleChangeSelectedPopcorns = (action, id, value) => {
        let popcornArray = [...selectdPopcorns];
        const updateToIndex = popcornArray.findIndex(popcorn => popcorn._id === id)
        switch (action) {
            case "UPDATE":
                if (updateToIndex > -1) {
                    popcornArray[updateToIndex].quantity = +value
                } else {
                    popcornArray.push({ _id: id, quantity: +value })
                }
                setSelectedPopcorns(popcornArray)
                break;
            case "MINUS":
                if (updateToIndex > -1) {
                    if (popcornArray[updateToIndex].quantity < 2) {
                        popcornArray.splice(updateToIndex, 1)
                    } else {
                        popcornArray[updateToIndex].quantity -= +value
                    }
                    setSelectedPopcorns(popcornArray)
                }
                break;
            case "PLUS":
                if (updateToIndex > -1) {
                    popcornArray[updateToIndex].quantity += +value
                } else {
                    popcornArray.push({ _id: id, quantity: +value })
                }
                setSelectedPopcorns(popcornArray)
                break;
            default: break;
        }
    }

    return (
        <div className="popcorns-selection selection-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-semibold">
                    Danh sách Combo
                </span>
            </div>
            <div className="popcorns-selection-list">
                {popcorns && popcorns.list && popcorns.list.map((item, index) => {
                    return (
                        <div className="popcorns-selection-combo">
                            <img className="popcorns-selection-combo-image" src={item.image} alt="combo-image" />
                            <div className="popcorns-selection-combo-content" >
                                <div className="popcorns-selection-combo-text">
                                    <div className="fw-semibold">{item.name}</div>
                                    <div className="fst-italic">{item.description}</div>
                                    <div className="fw-semibold">
                                        <span>Giá: </span>
                                        <NumericFormat value={item.price} decimalSeparator="," thousandSeparator="." displayType="text" suffix=" đ" />
                                    </div>
                                </div>
                                <div className="popcorns-selection-combo-actions">
                                    <i onClick={() => handleChangeSelectedPopcorns("MINUS", item._id, 1)} className="popcorns-selection-combo-icon fa-solid fa-minus"></i>
                                    <input onChange={(event) => handleChangeSelectedPopcorns("UPDATE", item._id, event.target.value)} value={+selectdPopcorns.find(popcorn => popcorn._id === item._id)?.quantity || 0} type="number" className="popcorns-selection-combo-quantity" />
                                    <i onClick={() => handleChangeSelectedPopcorns("PLUS", item._id, 1)} className="popcorns-selection-combo-icon fa-solid fa-plus"></i>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default PopcornSelection