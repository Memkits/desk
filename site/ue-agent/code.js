// 代码卡（示意）
CODE.call = { fn: 'MCP 工具调用（JSON-RPC，示意；工具名和参数为虚构）', fs: 24, cols: [['智能体 → 编辑器', `{
  "method": "tools/call",
  "params": {
!!    "name": "spawn_actor",
    "arguments": {
      "class": "PointLight",
      "location": [400, 0, 280],
      "label": "Room3_Light"
    }
  }
}`, '#C79BFF'], ['编辑器 → 智能体', `{
  "result": {
    "content": [{
      "type": "text",
!!      "text": "已创建 Room3_Light"
    }]
  }
}

// 下一步：截图，核对灯的位置`, '#5FE0A0']],
  note: '每个工具都由引擎定义：开放什么、能改什么，引擎说了算' };
