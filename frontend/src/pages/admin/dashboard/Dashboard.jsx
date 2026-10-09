import React, { useContext } from 'react'
import {FaUserTie } from 'react-icons/fa';
import myContext from '../../../context/data/myContext';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';
import {MdProductionQuantityLimits} from "react-icons/md"
import {BsBagFill} from "react-icons/bs"

function Dashboard() {
    const context = useContext(myContext)
    const { mode, product, user, order} = context
  return (
    <Layout>
        <section className="text-gray-600 body-font mt-10 mb-10">

            <div className="container px-5 mx-auto mb-10">
                <div className="flex flex-wrap -m-4 text-center justify-between">
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div className=" border-2 bg-gray-100 border-gray-100 shadow-2xl hover:scale-105 transition-all duration-150 px-4 py-3 rounded-xl" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                            <div className="text-purple-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                                <MdProductionQuantityLimits size={50} />
                            </div>
                            <h2 className="title-font font-medium text-3xl text-black fonts1" style={{ color: mode === 'dark' ? 'white' : ''}}>{product.length}</h2>
                            <p className=" text-purple-500  font-bold" style={{ color: mode === 'dark' ? 'white' : ''}}>Total Products</p>
                        </div>
                    </div>
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div className=" border-2 bg-gray-100 border-gray-100 shadow-2xl hover:scale-105 transition-all duration-150 px-4 py-3 rounded-xl" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }}>
                            <div className="text-purple-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                                <BsBagFill size={50} />
                            </div>
                            <h2 className="title-font font-medium text-3xl text-black fonts1" style={{ color: mode === 'dark' ? 'white' : ''}}>{order.length}</h2>
                            <p className=" text-purple-500  font-bold" style={{ color: mode === 'dark' ? 'white' : ''}}>Total Orders</p>
                        </div>
                    </div>
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div className=" border-2 bg-gray-100 border-gray-100 shadow-2xl hover:scale-105 transition-all duration-150 px-4 py-3 rounded-xl" style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '', color: mode === 'dark' ? 'white' : '', }} >
                            <div className="text-purple-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                                <FaUserTie size={50} />
                            </div>
                            <h2 className="title-font font-medium text-3xl text-black fonts1" style={{ color: mode === 'dark' ? 'white' : ''}}>{user.length}</h2>
                            <p className=" text-purple-500  font-bold" style={{ color: mode === 'dark' ? 'white' : ''}}>Total Users</p>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <DashboardTab/>
        </section>
    </Layout>
  )
}

export default Dashboard