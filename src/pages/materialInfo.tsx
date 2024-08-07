import React, { useRef } from "react";
import MyTable from "../components/table";
import { useMount, useSetState } from "ahooks";
import HeadTitle from "../components/headTitle";
import styles from "../App.module.scss";
import { Modal, message } from "antd";
import MyForm from "../components/Form/index";
import { Bus, random } from "../utils";

let formList = [
  {
    key: "density",
    type: "input",
    inputType: "number",
    isRequired: true,
    title: "密度（cm³）",
    placeholder: "请输入",
  },
  {
    key: "viscosity",
    type: "input",
    inputType: "number",
    isRequired: true,
    title: "粘度（Pa·s）",
    placeholder: "请输入",
  },
  {
    key: "temperature",
    type: "input",
    inputType: "number",
    isRequired: true,
    title: "玻璃化转变温度（°C）",
    placeholder: "请输入",
  },
  {
    key: "rate",
    type: "input",
    inputType: "number",
    isRequired: true,
    title: "熔体质量流动速率（g/10min）",
    placeholder: "请输入",
  },
  {
    key: "strength",
    type: "input",
    inputType: "number",
    isRequired: true,
    title: "拉伸强度（MPa）",
    placeholder: "请输入",
  },
];

function generateMaterialData() {
  const dataArray = [];
  for (let i = 0; i < 10; i++) {
    const name = String.fromCharCode(65 + i); // A到J的ASCII码
    let type;
    if (i < 3) {
      // A到C
      type = "主料";
    } else if (i >= 3 && i < 8) {
      // D到H
      type = "辅料";
    } else {
      // I到J
      type = "填料";
    }

    const density = `${random(0.2, 2.0).toFixed(1)}`;
    const viscosity = `${random(0.2, 2.0).toFixed(2)}`;
    const temperature = `${Math.floor(random(0, 30))}`;
    const rate = `${random(0, 1).toFixed(1)}`;
    const strength = `${Math.round(random(100, 500))}`;

    dataArray.push({
      id: i,
      name,
      type,

      density,
      viscosity,
      temperature,
      rate,
      strength,
    });
  }
  return dataArray;
}

let list = [] as any;
export default function MaterialInfo() {
  const [tableData, setTableData] = useSetState({
    list: [] as any,
    pageNum: 1,
    pageSize: 10,
    total: 10,
  });

  const useForm = useRef() as any; // 存储头部form表单的实例

  const [formData, setFormData] = useSetState({
    // 新增 编辑 form表单值
    clickItem: {} as any,
    flag: false,
    operation: "add",
  });

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "类别",
      dataIndex: "type",
      align: "center",
    },

    {
      title: "密度",
      dataIndex: "density",
      align: "center",
      render: (text: string) => <div>{text} g/cm³</div>,
    },
    {
      title: "粘度",
      dataIndex: "viscosity",
      align: "center",
      render: (text: string) => <div>{text} Pa·s</div>,
    },
    {
      title: "玻璃化转变温度",
      dataIndex: "temperature",
      align: "center",
      render: (text: string) => <div>{text} 摄氏度</div>,
    },
    {
      title: "熔体质量流动速率",
      dataIndex: "rate",
      align: "center",
      render: (text: string) => <div>{text} g/10min</div>,
    },
    {
      title: "拉伸强度",
      dataIndex: "strength",
      align: "center",
      render: (text: string) => <div>{text} MPa</div>,
    },
    {
      title: "操作",
      dataIndex: "operation",
      align: "center",
      width: 180,
      fixed: "right",
      render: (text: any, record: any, index: number) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className={styles.operation}
            style={{ color: "#008A16" }}
            onClick={() => resetItem(record)}
          >
            编辑
          </div>
        </div>
      ),
    },
  ];

  useMount(() => {
    list = generateMaterialData();
    setTableData({ list });
  });

  useMount(() => {
    Bus.on("headSearch", (value) => {
      // 使用filter方法来更新filteredItems
      const filtered = list.filter((item: any) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });

      setTableData({ list: filtered });
    });
  });

  // 编辑某一项
  function resetItem(record: any) {
    setFormData({
      flag: true,
      clickItem: record,
    });
  }

  const onFinish = (values: any, type: string) => {
    console.log("Success:", values);

    let list = tableData.list.slice();

    list[formData.clickItem.id] = {
      ...list[formData.clickItem.id],
      ...values,
    };

    setTableData({ list });
    setFormData({ flag: false });
    message.success("修改成功~");
  };

  /** from 表单提交时错误 */
  const onFinishFailed = (errorInfo: any, type: string) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <HeadTitle title="原材料信息" />

      <div className={styles.tableContent}>
        <div className={styles.tableTitle}>
          <div className={styles.title}>产品信息 </div>
        </div>

        <MyTable
          columns={columns}
          dataSource={tableData.list}
          page={tableData.pageNum}
          pageSize={tableData.pageSize}
          total={tableData.list.length}
          rowKey={(record) => record.id}
          scroll={{ x: "max-content" }}
          // onPChange={(pageNum, pageSize) => {
          //   let values = objDefault(headUseForm.current.getFieldsValue())
          //   requerList({
          //     ...values,
          //     pageNum,
          //     pageSize,
          //   })
          // }}
        />
      </div>

      <Modal
        centered
        footer={null}
        title={"编辑信息 - " + formData.clickItem.name}
        open={formData.flag}
        onCancel={() => {
          setFormData({ flag: false });
          useForm.current.resetFields();
        }}
        wrapClassName={styles.formDataMoadl}
      >
        <MyForm
          fieldsValue={formData.clickItem}
          confirmText="确认"
          onFinish={(e: any) => onFinish(e, "search")}
          onFinishFailed={(e) => onFinishFailed(e, "search")}
          formList={formList}
          // arrangement="row"
          ref={useForm}
          // bottomIsShow={false}
          onCancel={(e: any) => {
            e.resetFields();
          }}
        />
      </Modal>
    </div>
  );
}
