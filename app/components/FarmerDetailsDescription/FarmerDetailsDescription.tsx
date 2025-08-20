

import React from "react";
import styles from "./FarmerDetailsDescription.module.scss";

interface Props {
  description: string;
}

const FarmerDetailsDescription = ({ description }: Props) => {
  if (!description) return null;

  return (
    <div className={styles.descriptionWrapper}>
      <h2>ჩემს შესახებ</h2>
      <p>{description}</p>
    </div>
  );
};

export default FarmerDetailsDescription;
