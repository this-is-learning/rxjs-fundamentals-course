import clsx from 'clsx';
import React from 'react';

import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: "Openly available",
    Svg: require("../../static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        No memberships, paywalls, custom platforms, or geopgraphical
        restrictions.
      </>
    ),
  },
  {
    title: "Always free",
    Svg: require("../../static/img/undraw_docusaurus_tree.svg").default,
    description: <>Open Learning courses are free for everyone, forever.</>,
  },
  {
    title: "Open to contributions of any size",
    Svg: require("../../static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        <strong>You</strong> are more than welcome to improve this course.
        Together we can.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
