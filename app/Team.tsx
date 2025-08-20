/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "./page.module.css";

const Team = () => {
    return (
        <main id="team" className={styles.team}>
           <h1 className={styles.meet}>Meet the team</h1>
           <div className={styles.teamContainer}>
            <div className={`${styles.lead} ${styles.president}`}>
                <img src="/amn.png" alt="pres" height={175}/>
                <p>Azza Jomni</p>
                <p>President</p>
            </div>
            <div className={`${styles.lead} ${styles.vp}`}>
                <img src="/amn.png" alt="vp" height={175}/>
                <p>Tasnim Msallim</p>
                <p>Vice President</p>
            </div>
            <div className={`${styles.lead} ${styles.gs}`}>
                <img src="/amn.png" alt="gs" height={175}/>
                <p>Tasnim Msallim</p>
                <p>General Secretary</p>
            </div>
            <div className={`${styles.lead} ${styles.td}`}>
                <img src="/amn.png" alt="td" height={175}/>
                <p>Mohamed Belgacem</p>
                <p>Training and Development Department</p>
            </div>
            <div className={`${styles.lead} ${styles.pm}`}>
                <img src="/amn.png" alt="pm" height={175}/>
                <p>Fedi</p>
                <p>PM Department</p>
            </div>
            <div className={`${styles.lead} ${styles.hr}`}>
                <img src="/amn.png" alt="hr" height={175}/>
                <p>Ata Bouslah</p>
                <p>HR Department</p>
            </div>
            <div className={`${styles.lead} ${styles.er}`}>
                <img src="/amn.png" alt="er" height={175}/>
                <p>Ata Bouslah</p>
                <p>ER Department</p>
            </div>
            <div className={`${styles.lead} ${styles.mrk}`}>
                <img src="/amn.png" alt="mrk" height={175}/>
                <p>Mohamed Belgacem</p>
                <p>Marketing Department</p>
            </div>
           </div> 
        </main>
    );
};

export default Team;
