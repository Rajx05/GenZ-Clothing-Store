import { useEffect, useState } from "react";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { order, setOrder, orderLoading, setOrderLoading, fetchOrders } =
    useApp();
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  const [sortedOrder, setSortedOrder] = useState([
    {
      date: null,
      items: [],
      totalItems: 0,
      total: 0,
      color: null,
      price: null,
      paymentStatus: null,
    },
  ]);

  // fetch orders
  useEffect(() => {
    console.log("log in status:", loggedIn.status);
    if (loggedIn.status) {
      console.log("orders fetched");
      fetchOrders();
    } else {
      navigate("/profile");
    }
  }, [loggedIn.status]);

  //   sort data
  useEffect(() => {
    if (order && order.length > 0) {
      const sorted = order.map((order) => ({
        date: order.createdAt,
        items: order.items,
        totalItems: order.items.length,
        total: order.totalAmount,
        paymentStatus: order.paymentStatus,
      }));
      console.log("sorted:", sorted);
      setSortedOrder(sorted);
    }
  }, [order]);

  console.log("order:", order);
  console.log("sorted order:", sortedOrder);
  return (
    <div className="flex flex-col items-center justify-center gap-4 border p-6">
      <div className="mb-2">
        <h1>Your Orders</h1>
      </div>

      {sortedOrder.map((order, i) => (
        <div key={order.id} className="border">
          <div className="flex flex-col  min-h-60  ">
            {/* Top Row */}
            <div className="flex justify-between border-b gap-12  min-w-64 p-4">
              {/* Order & Date */}
              <div>Order: {i + 1}</div>
              <div>
                {new Date(order.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div>
                <div>Payment Status: {order.paymentStatus}</div>
              </div>
            </div>

            {/* Second Row */}
            <div className="flex border-b justify-between">
              <div className="p-2 min-w-52 border ">Items </div>
              <div className="p-2 border min-w-12 "> Qty </div>
              <div className="p-2 border "> Color </div>
              <div className="p-2 border"> Price </div>
            </div>
            <div className="flex justify-between ">
              <div>
                {order.items.map((item) => (
                  <div
                    key={order._id}
                    className="flex border min-h-16 min-w-52"
                  >
                    {/* image */}
                    <div>
                      <img
                        src={item.product.image}
                        height="64"
                        width="42"
                      ></img>
                    </div>
                    {/* product name */}
                    <div>{item.product.name}</div>
                  </div>
                ))}
              </div>
              <div>
                {order.items.map((item) => (
                  <div key={order._id} className="min-h-16 min-w-8 text-center">
                    {item.quantity}
                  </div>
                ))}
              </div>

              <div>
                {order.items.map((product) => (
                  <div key={order._id} className=" min-h-16">
                    {product.color}
                  </div>
                ))}
              </div>
              <div>
                {order.items.map((item) => (
                  <div key={order._id} className="min-h-16 ">
                    {item.product.price} x {item.quantity}
                  </div>
                ))}
              </div>
            </div>

            {/* Body  */}
            {/* items */}
          </div>

          {/* Total */}
          <div className="flex border-t justify-between">
            <div className="p-2 ">Total Amount: </div>
            <div className="p-2 ">{order.total} </div>
          </div>
        </div>
      ))}
    </div>
  );
}
