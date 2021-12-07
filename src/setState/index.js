// 多个update对象组成hook对象的queue.pending单向环状链表
// const update = {
//   // 更新执行的函数
//   action,
//   // 与同一个Hook的其他update形成链表
//   next: null
// }

// 一个useState对应一个hook对象
// const hook = {
//   // 保存update的queue
//   queue: {
//     pending: null
//   },
//   // 保存hook对应的state
//   memoizedState: initialState,
//   // 与下一个Hook连接形成单向无环链表
//   next: null
// }

// App组件对应的fiber对象
const fiber = {
  // 保存该FunctionComponent对应的Hooks链表
  memoizedState: null, // 多个useState的hook对象组成一个单向无环链表
  // 指向App函数
  stateNode: App
};

// 首次render时是mount
isMount = true;

function schedule() {
  // 更新前将workInProgressHook重置为fiber保存的第一个Hook
  workInProgressHook = fiber.memoizedState;
  // 触发组件render
  const app = fiber.stateNode();
  // 组件首次render为mount，以后再触发的更新为update
  isMount = false;
  return app;
}

// 新建一个update接入到hook的queue.pending单向环状链表，
// queue.pending指向最新的接入的update
function dispatchAction(queue, action) {
  // 创建update
  const update = {
    action,
    next: null
  }
  // 环状单向链表操作
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  // 模拟React开始调度更新
  schedule();
}

let workInProgressHook = null; // 当前指向的hook对象

const useState = (initialState) => {
  // 当前useState使用的hook会被赋值该该变量
  let hook;

  if (isMount) {
    // ...mount时需要生成hook对象
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }
    // 将hook插入fiber.memoizedState链表末尾
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    // 移动workInProgressHook指针（等于移到链表末尾）
    workInProgressHook = hook;
  } else {
    // update时从workInProgressHook中取出该useState对应的hook
    hook = workInProgressHook;
    // 移动workInProgressHook指针
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // 获取update环状单向链表中第一个update
    let firstUpdate = hook.queue.pending.next;

    do {
      // 执行update action
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;

      // 最后一个update执行完后跳出循环
    } while (firstUpdate !== hook.queue.pending.next)

    // 清空queue.pending
    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function App() {
  const [num, updateNum] = useState(0);

  console.log(`${isMount ? 'mount' : 'update'} num: `, num);

  // return <p onClick={() => updateNum(num => num + 1)}>{num}</p>;
  return({
    click() {
      updateNum(num => num + 1);
    }
  })
}
window.app = schedule();
