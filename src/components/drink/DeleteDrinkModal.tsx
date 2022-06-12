import React, { FormEvent, useContext, useRef, useState } from "react";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";
import { ref, remove, set, update } from "firebase/database";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface Props {
  drinkId: string;
  open: boolean;
  setOpen: (state: boolean) => void;
}

const DeleteDrinkModal = ({ drinkId, open, setOpen }: Props) => {
  const [loading, setLoading] = useState(false);
  const {
    data: { users: customers },
  } = useContext(AuthContext);
  const owners = customers.filter((customer) =>
    customer.relationships.orders.some((ord) => ord.drinkId == drinkId)
  );
  const handleDelete_Order = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await remove(ref(db, `bottles/${drinkId}`));
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
        {/* <p className="">Hola</p> */}
        {owners.length > 1 && (
          <div className="card-title">ボトルを削除出来ない</div>
        )}

        <div className="card-body">
          <div className="pt-2 flex flex-col align-middle justify-center items-center text-left max-h-44 overflow-scroll">
            {owners.map((owner) => (
              <div key={owner.uid}>
                <Link to={`all?qr=${owner.uid}`} className="focus:outline-none">
                  <p className="link ">{owner.attributes.name}</p>
                </Link>
              </div>
            ))}
          </div>
          <div className="form-control mt-6">
            <input
              type="button"
              value="ボトルを削除する"
              className="btn btn-error text-white"
              onClick={handleDelete_Order}
              disabled={loading || owners.length > 1}
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

export default DeleteDrinkModal;
