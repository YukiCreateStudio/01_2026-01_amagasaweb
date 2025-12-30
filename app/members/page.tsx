import { MembersType } from "@/dataType/type";
import { members } from "@/data/member";
import styles from "./page.module.css";
import Image from "next/image";

export default function Page() {
  return (
    <>
      {members.contents.length === 0 ? (
        <p className={styles.text}>メンバーが登録されていません</p>
      ) : (
        <ul>
          {members.contents.map((member: MembersType) => (
            <li key={member.id} className={styles.list}>
              <Image
                className={styles.image}
                src={member.image.url}
                alt=""
                width={member.image.width}
                height={member.image.height}
              />
              <dl>
                <dt className={styles.name}>{member.name}</dt>
                <dd className={styles.position}>{member.position}</dd>
                <dd className={styles.profile}>{member.profile}</dd>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
