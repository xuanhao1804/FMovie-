import { useSelector } from "react-redux"
import "./CitySelection.scss"

const CitySelection = ({ selectedCity, setSelectedCity, movieSelectionRef }) => {

    const { city } = useSelector((state) => state)
    return (
        <div className="city-selection selection-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-semibold">
                    Chọn vị trí
                </span>
                {/* <span style={{ aspectRatio: "1" }}>
                    <i className="bg-primary text-white p-1 rounded-circle fa-solid fa-plus"></i>
                </span> */}
            </div>
            <div className="city-selection-list">
                {city && city.list && city.list.length > 0 &&
                    city.list.map((item, index) => {
                        return (
                            <button onClick={() => {
                                setSelectedCity(item)
                                movieSelectionRef.current.scrollIntoView()
                            }} className={item._id === selectedCity._id ? "city-selection-item-selected" : "city-selection-item"} key={"cities-" + index}>{item.name}</button>
                        )
                    })
                }
            </div>
        </div >
    )
}

export default CitySelection