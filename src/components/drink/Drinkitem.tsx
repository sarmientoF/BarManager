import React, { useState } from "react";

import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import * as style from "@dicebear/avatars-initials-sprites";

import UpdateDrinkModal from "../modals/UpdateDrinkModal";
import { createAvatar } from "@dicebear/avatars";
import { Bottle } from "../../data/data";
import DeleteDrinkModal from "./DeleteDrinkModal";

interface Props {
  drink: Bottle;
}

const DrinkItem = ({ drink }: Props) => {
  const uid = drink.uid;

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const photo =
    drink.attributes.url ||
    createAvatar(style, {
      seed: drink.attributes.name,
      dataUri: true,
    });

  return (
    <>
      <DeleteDrinkModal
        drinkId={uid}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
      <UpdateDrinkModal drink={drink} open={open} setOpen={setOpen} />
      <div className="card bordered text-left bg-base-100 shadow-lg">
        <figure className="relative inline-flex shadow-2xl">
          <div className="flex justify-around">
            <img src={photo} alt="" className="object-cover w-full h-64" />
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="btn btn-accent btn-circle absolute bottom-4 right-4 shadow-lg"
            >
              <BiEdit className="fill-current w-[50%] h-[50%]" />
            </button>
            <button
              onClick={() => {
                setDeleteOpen(true);
              }}
              className="btn btn-error text-white btn-circle absolute bottom-4 left-4 shadow-lg"
            >
              <MdDelete className="fill-current w-[50%] h-[50%]" />
            </button>
          </div>
        </figure>

        <div className="card-body justify-end">
          <h2 className="card-title  justify-self-start line-clamp-1">
            {drink.attributes.name || "No name yet"}
          </h2>
          <p className="overflow-ellipsis flex-grow overflow-hidden line-clamp-2">
            {drink.attributes.memo}
          </p>
          {/* <div className="card-actions">
						<button
							onClick={() => {
								setDel(true);
							}}
							className="btn btn-error text-white"
						>
							削除
						</button>
					</div> */}
        </div>
      </div>
    </>
  );
};

export default DrinkItem;
