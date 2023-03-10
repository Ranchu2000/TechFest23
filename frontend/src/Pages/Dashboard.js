import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ResupplyModal from "../Modals/ResupplyModal";
import Table from "../Components/Table";
import Header from "../Components/Header";
import Choice from "../Components/Choice";
import StatBar from "../Components/StatBar";
import DataViz from "../Components/DataViz";
import { TextboxTwo } from "../Components/Textbox";

function Dashboard() {
    const tableRef = useRef(null);


    const items = ["Apple", "Samsung"];
    const [showModal, setShowModal] = useState(false);
    const [make, setMake] = useState("");
    const [arr, setArr] = useState([]); // for rendering
    const [shortfallArr, setShortfallArr] = useState([]); // for rendering 
    const [shortfall, setShortfall] = useState(false);
    const [stockChange, setStockChange] = useState(["", 0]);
    const [update, setUpdate] = useState(false);
    const [sortBy, setSortBy] = useState("date");
    const devices = useMemo(() => ({
        "Apple": [["APPLMD211000", "iPhone 13", 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], ["APPLMD221000", "iPhone 14", 200000, 0, [53399, 52569, 52310, 49839, 50011, 49344, 49819, 50120, 50964, 50633]]],
        "Samsung": [["SAMGSMD211000", "Galaxy S21", 10000, 0, [2000, 1000, 2400, 2500, 1200, 5200, 3600, 1100, 2700, 4500]], ["SAMGSMD221000", "Galaxy S22", 12000, 0, [21415, 21419, 21493, 21129, 19258, 10508, 7222, 0, 0, 0]], ["SAMGSMD231000", "Galaxy S23", 50000, 0, [0, 0, 0, 0, 93939, 86524, 71681, 53602, 47661, 43171]]],
        "": []
    }), []);
    const [weeks, setWeeks] = useState(1);

    useEffect(() => {
        setWeeks(2);
    }, []);

    const weekChangeHandler = useCallback(() => {
        for (let i = 0; i < devices[make].length; i++) {
            let temp = 0;
            for (let j = 0; j < weeks; j++) {
                temp += devices[make][i][4][j];
            }
            devices[make][i][3] = temp;
        }
        setUpdate(true);
    }, [weeks, devices, make]);

    useEffect(() => {
        weekChangeHandler();
    }, [weeks, weekChangeHandler]);

    const renderChange = useCallback(() => {
        let render = [];
        setShortfall(false);
        setUpdate(false);
        for (let i = 0; i < devices[make].length; i++) {
            render.push(
                <StatBar title={["In-Stock", "Demand Forecast"]} setShortfall={shortfall => setShortfall(shortfall)} setShortfallArr={shortfallArr => setShortfallArr(shortfallArr)}
                    sku={devices[make][i][0]} name={devices[make][i][1]} value={[devices[make][i][2], devices[make][i][3]]}
                />
            )
        }
        return render;
    }, [devices, make]);

    useEffect(() => {
        setShortfallArr([]);
        setArr(renderChange()); // for rendering
    }, [make, renderChange, update]);

    const changeStockHandler = useCallback(() => {
        for (let i = 0; i < devices[make].length; i++) {
            if (devices[make][i][1] === stockChange[0]) {
                devices[make][i][2] += parseInt(stockChange[1]);
                setStockChange(["", 0]);
                setUpdate(true);
            }
        }
    }, [devices, make, stockChange])

    useEffect(() => {
        changeStockHandler();
    }, [stockChange, changeStockHandler]);

    const sortByHandler = (mode) => {
        setSortBy(mode);
    }
    useEffect(()=>{
        setSortBy("");
    }, [sortBy]);

    return (
        <div class="">
            <Header />
            <div class="relative bg-gray-100 h-full">
                <div class="flex flex-row">
                    <div class="flex basis-1/3">
                        <div id="Inventory" class="fixed top-[76px] left-0 flex flex-col w-1/4 h-full  bg-slate-200 items-center">
                            <h2 class="text-lg bg-slate-100 text-center w-full mt-4 ">Inventory</h2>
                            <Choice item={items} setMake={make=>setMake(make)}/>
                            {make === "" ? <span class="h-1 w-64 rounded bg-slate-400 mt-7"/> :
                                <>
                                    <h3 class="text-base h-6">{make}</h3>
                                    <span class="h-1 w-64 mt-1 rounded bg-slate-400"/>
                                    {arr} 
                                </>
                            }
                            {make === "" ? null :
                                <div class="absolute bottom-20 rounded-md px-4 py-2 my-2 text-base text-gray-700 bg-red-400 ">
                                    <p class="text-center">Weeks</p>
                                    <TextboxTwo setChange={c=>setWeeks(c)} name={null}/>
                                </div>
                            }
                            {shortfall && make !== "" ?
                                <button
                                class="absolute bottom-44 rounded-md px-4 py-2 mt-4 text-base text-gray-700 bg-red-400 
                                    hover:text-gray-800 hover:bg-rose-300 active:text-gray-900 active:bg-red-400 active:shadow-sm"
                                    onClick={()=>setShowModal(true)}
                                >
                                    Resupply
                                </button>
                                :null}
                                
                            
                        </div>
                    </div>
                    <div class="flex basis-2/3 flex-col mt-20">
                        <DataViz sortByHandler={sortByHandler} tableRef={tableRef}/>
                        <div ref={tableRef}>
                            <Table sortBy={sortBy} />
                        </div>
                    </div>
                </div>
            </div>
            <ResupplyModal onClose={()=>setShowModal(false)} show={showModal} make={make} shortfallArr={shortfallArr}
                                setStockChange={c=>setStockChange(c)}/>
        </div>
    );
}
export default Dashboard;
