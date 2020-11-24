import { Card } from 'antd';
import TableExpand from './TableExpand';
export default function() {
  return (
    <div>
        <Card 
        title={<h1>实验课</h1>}
        bordered={false}
        >
            <TableExpand />
        </Card>
    </div>
  );
}
