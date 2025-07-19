import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Magnet, ArrowUp, ArrowDown } from "lucide-react";
import { Slider } from "./ui/slider";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const MagCueSimulator = () => {
  const [currentIntensity, setCurrentIntensity] = useState(0);
  const [isPositive, setIsPositive] = useState(true);
  const [handlePosition, setHandlePosition] = useState(200); // 初始位置：手柄放在底座上
  const [isDragging, setIsDragging] = useState(false);
  const [interactionLog, setInteractionLog] = useState([]);

  // 简化的碰撞检测系统
  const handleCollision = (newPosition) => {
    const baseTop = 320; // 底座顶部位置（容器底部）
    const handleHeight = 48; // 手柄高度
    const handleBottom = newPosition + handleHeight;

    // 碰撞检测：手柄底部不能穿过底座顶部
    if (handleBottom > baseTop) {
      return baseTop - handleHeight; // 返回碰撞后的位置
    }

    return newPosition;
  };

  // 计算手柄位置
  const getHandlePosition = () => {
    if (isDragging) {
      return handlePosition;
    }

    // 物理模拟：基于电流强度和极性
    let targetPosition = 272; // 默认放在底座上 (320 - 48)

    if (currentIntensity > 0) {
      if (isPositive) {
        // 正极：吸引力，手柄向下移动（更靠近底座）
        targetPosition = 272 - currentIntensity * 1;
      } else {
        // 负极：排斥力，手柄向上移动
        targetPosition = 272 + currentIntensity * 2;
      }
    }

    // 应用碰撞检测
    return handleCollision(targetPosition);
  };

  // 拖拽处理
  const handleDragStart = () => {
    setIsDragging(true);
    setInteractionLog((prev) => [...prev, `开始拖拽手柄`]);
  };

  const handleDrag = (event, info) => {
    const newPosition = info.point.y;
    const collisionAdjustedPosition = handleCollision(newPosition);
    setHandlePosition(collisionAdjustedPosition);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setHandlePosition(getHandlePosition()); // 回到物理计算的位置
    setInteractionLog((prev) => [...prev, `结束拖拽，手柄回到物理位置`]);
  };

  // 渲染磁场指示器
  const renderMagneticField = () => {
    if (currentIntensity === 0) return null;

    const isAttraction = isPositive && currentIntensity > 0;
    const isRepulsion = !isPositive && currentIntensity > 0;

    return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
        {isAttraction && (
          <div className="flex items-center gap-1 text-red-500">
            <ArrowDown className="w-4 h-4" />
            <span className="text-sm font-medium">吸引力</span>
          </div>
        )}
        {isRepulsion && (
          <div className="flex items-center gap-1 text-blue-500">
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">排斥力</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            MagCue 设备模拟器
          </h1>

          {/* 控制面板 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 电流强度控制 */}
            <div className="space-y-4">
              <label className="text-white font-medium">
                电流强度: {currentIntensity}mA
              </label>
              <Slider
                value={[currentIntensity]}
                onValueChange={([value]) => setCurrentIntensity(value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* 极性控制 */}
            <div className="space-y-4">
              <label className="text-white font-medium">极性</label>
              <div className="flex gap-2">
                <Button
                  variant={isPositive ? "default" : "outline"}
                  onClick={() => setIsPositive(true)}
                  className="flex-1"
                >
                  正极 (+)
                </Button>
                <Button
                  variant={!isPositive ? "default" : "outline"}
                  onClick={() => setIsPositive(false)}
                  className="flex-1"
                >
                  负极 (-)
                </Button>
              </div>
            </div>
          </div>

          {/* 模拟器容器 */}
          <div className="relative h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-white/20 overflow-hidden">
            {/* 磁场指示器 */}
            {renderMagneticField()}

            {/* MagCue 底座 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-t-lg border-2 border-gray-500 z-5">
              <div className="flex items-center justify-center h-full">
                <Magnet className="w-4 h-4 text-gray-300" />
              </div>
            </div>

            {/* MagCue 手柄 - 可拖拽 */}
            <motion.div
              className="w-20 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl border-2 border-white absolute z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: getHandlePosition(),
              }}
              drag="y"
              dragConstraints={{
                top: 0, // 向上最多到容器顶部
                bottom: 272, // 向下最多到初始位置（手柄放在底座上）
              }}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.05 }}
            >
              <Magnet className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          {/* 交互日志 */}
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <h3 className="text-white font-medium mb-2">交互日志</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {interactionLog.slice(-5).map((log, index) => (
                <div key={index} className="text-sm text-gray-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MagCueSimulator;
