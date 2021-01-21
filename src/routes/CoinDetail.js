import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2';
import styled from 'styled-components'
import './CoinDetail.css'

const options = {
    color: 'white',
    legend: {
        display: false
    },
    tooltips: {
        mode: "index",
        intersect: false,
        backgroundColor: 'grey'
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    parser: "MM/DD/YY",
                    tooltipFormat: "ll",
                    displayFormats: {
                        month: "M-YY"
                    }
                },
                ticks: {
                    fontColor: "white"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    beginAtZero: true,
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                    return '$' + value
                    },
                    fontColor: "white"
                }
            }
        ],
    }
}
const CoinDetail = ({location}) => {
    //const [state] = useState(location.state)
    console.log(location)
    const [data, setData] = useState({})
    const fetchData = async () => {
        return ((location.state !== undefined) &&
        await axios.get(`https://api.coingecko.com/api/v3/coins/${location.state.id}/market_chart?vs_currency=usd&days=180`)
            .then ( response => {
                let chartData = []
                for ( let dataObj of response.data.prices ) {
                    let newChartData = {
                        x: dataObj[0],
                        y: parseFloat(dataObj[1]).toFixed(2)
                    }
                    chartData.push(newChartData)
                }
                setData(chartData)
            }));
    }
    useEffect(fetchData, [])
    const[description, setDescription] = useState([])
    const fetchDescription = async () => {
        return ((location.state !== undefined) &&
        await axios.get(`https://api.coingecko.com/api/v3/coins/${location.state.id}?community_data=true`)
            .then ( response => {
                let coinDesc = response.data.description.en
                coinDesc = coinDesc.replace(/<a\s+.*?>/g, '')
                coinDesc = coinDesc.replace(/<(\/a>)/g, '')
                setDescription(coinDesc)
                console.log(coinDesc)
            }));
    }
    useEffect(fetchDescription, [])
        return ((location.state !== undefined) &&
            <Container>
                <Card className="fade">
                    <Header className="fade">
                        <img src={location.state.image} className="fade"/>
                        <h1 className='name fade'>{location.state.name}</h1>
                    </Header>
                         
                        {data?.length > 0 && (
                        <Line className="line"
                            data={{ 
                                datasets: [
                                    {
                                        label: 'Price',
                                        backgroundColor: 'rgba(143, 140, 215, 1)',
                                        borderColor: 'rgba(109, 111, 214, 1)',
                                        pointRadius: 1,
                                        data: data,
                                    }
                                ] 
                            }}
                            options={ options }
                        />
                        )}
                      
                        <small>Last updated: {location.state.updated.slice(0,10)} {location.state.updated.slice(11,19)}</small>
                       
                        <CardBody className="fade">
                        
                        <p>{description}</p>
                        </CardBody>
                </Card>
            </Container>
        )
}

export default CoinDetail

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    max-width: 1440px;
    margin: auto;
`;
const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    min-width: 0;
    width: 65vw;
    margin: 8em 0em;
    transition: all 0.2s ease-in;
    background: linear-gradient(146.81deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.16) 100%);
    backdrop-filter: blur(5px);
    border-radius: 30px;
    border: 2px solid rgba(255, 255, 255, 0.4);

    @media (max-width: 768px) {
        width: 90vw;
        margin: 6em 0em;
    }
`;
const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 4em;
    width: 75%;
    margin-top: 1em;
    margin-bottom: 2em;
    background-size: cover;
    
    img {
        position: relative;
        padding-right: 0.65em;
        height: 50px;
        width: 50px;
        border-radius: 45px;
        transition: all 0.2s ease-in;
        
        &:hover {
            box-shadow: 0px 17px 16px -11px rgba(47, 76, 120, 1);
            transform: translateY(3px);
        }
    }
    .name {
        font-weight: 600;
        font-size: 1.85rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`
const CardBody = styled.div`
    margin: 2em 0em;
    height: 40vh;
    width: 70%;
    overflow: scroll;
`