import React, { FormEvent, useContext, useRef, useState } from "react";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";
import { ref, remove, set, update } from "firebase/database";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  userId: string;
  order: { uid: string };
  open: boolean;
  setOpen: (state: boolean) => void;
}

const DeleteOrderModal = ({ userId, order, open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false);
  const {
    data: { users: customers },
  } = useContext(AuthContext);
  const owners = customers.filter((customer) =>
    customer.relationships.orders.some((ord) => ord.orderId == order.uid)
  );
  const handleDelete_Order = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await remove(ref(db, `orders/${order.uid}`));

    for await (const owner of owners) {
      remove(ref(db, `users/${owner.uid}/relationships/orders/${order.uid}`));
    }
    setLoading(false);
    setOpen(false);
  };
  const handleDelete_Client = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (owners.length == 1) {
      await remove(ref(db, `orders/${order.uid}`));
    }
    await remove(ref(db, `users/${userId}/relationships/orders/${order.uid}`));
    setLoading(false);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={`modal ${open && "modal-open"} transition-all`}>
      <span
        className="absolute w-full h-full"
        onClick={() => {
          setOpen(false);
        }}
      ></span>

      <div className="modal-box">
        <div className="card-body">
          <div className="form-control mt-6">
            <input
              type="button"
              value="注文を削除する"
              className="btn btn-error text-white"
              onClick={handleDelete_Order}
              disabled={loading}
            />
          </div>
          <div className="form-control mt-6">
            <input
              type="button"
              value="お客様を削除する"
              className="btn btn-info text-white"
              onClick={handleDelete_Client}
              disabled={loading}
            />
          </div>
          <div className="form-control mt-6">
            <input
              type="button"
              value="キャンセル"
              className="btn btn-ghost btn-outline text-white"
              onClick={handleClose}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
