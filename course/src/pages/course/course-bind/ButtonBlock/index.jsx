import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
export default () => (
  <div className={styles.container}>
    <div id="components-button-demo-block">
      <div>
        <Button type="primary" block>
          绑定教师
        </Button>
        {/* <Button block>Default</Button>
        <Button type="dashed" block>
          Dashed
        </Button>
        <Button type="link" block>
          Link
        </Button> */}
      </div>
    </div>
  </div>
);
