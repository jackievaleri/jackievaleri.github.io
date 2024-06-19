# PyCon US 2024

I really enjoyed attending [PyCon US](https://us.pycon.org/2024/) in Pittsburgh a few weeks ago. PyCon was a great opportunity to meet other people who use Python, from data scientists to software engineers to hobbyists. Many of the talks and tutorials were focused on learning new skills and Python programming paradigms, which was different than my previous experiences attending academic-centered conferences. While this shift from "sharing scientific updates" to "teaching the audience something new" took some time to get used to, PyCon was a great learning environment and I really feel like I leveled up my programming.

Now that I have had some time to reflect on what I learned, I wanted to share my takeaways. I attended some informative and interesting talks on GPU-accelerated dataframes and graphs as well as dataframe processing libraries, which I will highlight in Part 1. In Part 2, I do a deeper dive into Rust, a programming language which I had not heard much of before PyCon 2024 but which can make Python code faster and safer.


## Part 1: Highlights
#### cudf.pandas
cuDF is a GPU DataFrame library from [RAPIDS](https://rapids.ai) designed to accelerate dataframe processing tasks by leveraging the parallel processing power of GPUs. Though cuDF started as a stand-alone package with a similar API to pandas, you can now add just two lines (below) to your pandas code to enable GPU usage by pandas functions! No other code needs to change. I tried cudf.pandas and saw a speed-up using `join`, `groupby`, and `sort_values` operations on a large dataframe from ~13 seconds to <0.5 seconds! This is a great performance booster for relatively little effort and I have already started using cudf.pandas in my code to speed up operations on pandas dataframes.

The cudf.pandas library supports most, but not all, pandas functions. If a function is unsupported, the function automatically falls back to CPU (which can add significant overhead to your code if done frequently). Something I like about cudf.pandas is that the provided `profiler` makes it easy to tell which of your code runs on GPU and on CPU. Check it out [here](https://github.com/rapidsai/cudf) (and FYI, cudf.pandas comes pre-installed on [Google Colab](https://developer.nvidia.com/blog/rapids-cudf-instantly-accelerates-pandas-up-to-50x-on-google-colab/)    now!).

`%load_ext cudf.pandas`
`import pandas as pd`

#### cugraph
`cugraph` is another powerful library within the RAPIDS suite, aimed at accelerating graph analytics on GPUs. With the new `cugraph` backend for NetworkX, we can now use GPU acceleration for NetworkX-based graph algorithms. Like cudf.pandas, the function automatically drops back down to CPU if the algorithm or graph function is not supported on GPU. This cugraph backend is made possible by NetworkX’s new paradigm of ‘dispatching’, which you can read more about [here](https://developer.nvidia.com/blog/accelerating-networkx-on-nvidia-gpus-for-high-performance-graph-analytics/).

#### ibis
[Ibis](https://ibis-project.org) is a powerful dataframe library that aims to provide a consistent API for querying data stored in various backends (e.g., SQL databases or dataframes from libraries such as pandas and polars.). I do not personally write much SQL code, but I sometimes need to query SQL-based databases like SQLite and PostgreSQL. What stood out to me was how Ibis enables you to write code that is backend-agnostic, meaning you can write your code once and run it across different platforms without modification. For example, I could test filtering and grouping code on a small pandas dataframe and then apply the same filtering and grouping procedure to a SQL database because of the ability to unbind code from the backend. I also appreciated that the Ibis API is similar to pandas, so I was able to get started quickly without a steep learning curve.


## Part 2: Rust
One of my big takeaways from PyCon US 2024 is that Rust is fast! For those like me who were unfamiliar with Rust, Rust is a programming language designed for speed and safety. I attended a fantastic [tutorial on Rust and PyO3](https://github.com/Cheukting/py03_101) (more on that later) by Cheuk Ting Ho that really helped my understanding.

#### Rust vs. Python
There are a few notable differences if you are coming to Rust from a Python background:

- **Compiled**: Rust is compiled where Python is interpreted. The consequence of this for data scientists and developers is that Python has a quicker development cycle; you make changes in your Python code and you can immediately test that code. In Rust, you first need to change your code, compile that code, and then test the code. This adds some time to the development process but constraints enforced during compilation make the behavior of the code more predictable.

- **Strongly typed**: Rust has a robust type system that catches errors at compile time, reducing the likelihood of bugs and making the code more reliable. This will feel different for programmers used to Python, which is dynamically typed.

- **Ownership and Borrowing**:  Rust enforces strict rules about how memory is managed, preventing common bugs like null pointer dereferencing* and data races** by ensuring each piece of data has a single owner. However, Rust does allow references to data without transferring ownership. These references must obey certain rules about how long they are valid, ensuring memory safety without garbage collection. If data is being used in more than one place, it can only be borrowed mutably – where modifications can happen – in one place.
Essentially, writing Python modules in Rust instead of Python can make your Python code run faster and safer. The idea of borrowing and ownership mean we can implement truly concurrent functions in Rust. Since we don’t have true multi-threading in Python due to the GIL (which could be its own blog post), this mean you can take computationally heavy tasks that would be slow in Python and speed them up by using Rust under the hood.

#### Using Rust in Python
But how does someone who codes in Python use Rust, a separate language? I learned that PyO3 is a library that lets you write Python modules in Rust by providing Rust bindings for Python. PyO3 is the definitive package for integrating Rust with Python. It allows you to write Python modules in Rust, giving you the performance benefits of Rust while still working within the Python ecosystem. You can decorate code snippets in Rust with macros – in other words, PyO3-specific decorators – that allow these Rust functions, classes, and modules to be easily used in Python code.

Sidenote: the idea of speeding up Python code is not new. For example, Cython is a tool that lets you write C extensions for Python, giving you the ease of Python with the speed of C. As I understand it, PyO3 is to Rust what Cython is to C. 

So, what does all this mean for every-day data scientists? If you develop Python code, check out PyO3 as well as the package `maturin`, which can help you set up a Rust project and compile your Rust code. If you don’t write new Python packages, keep your eye out for faster alternatives to your regular libraries or new versions of packages rewritten with Rust.

Many libraries already use Rust:

- [Polars](https://pola.rs) is a fast DataFrame library that leverages Rust to handle large datasets efficiently (move over, pandas).

- In [Pydantic V2](https://docs.pydantic.dev/latest/), data validation is even faster because the package maintainers have rewritten many Python functions in Rust. Some speed-ups are achieved by keeping objects in Rust longer and avoiding materializing objects in Python when they can be kept in Rust. It [may not be trivial](https://medium.com/codex/migrating-to-pydantic-v2-5a4b864621c3) to migrate from Pydantic V1 to Pydantic V2, so make sure to check the official Pydantic [migration guide](https://docs.pydantic.dev/latest/migration/).

- [Ruff](https://github.com/astral-sh/ruff) is a linter that is written in Rust, providing 10-100x faster linting for Python code than Flake8 and Black. Get started using Rust in your projects [here](https://ericmjl.github.io/blog/2023/10/9/its-time-to-upgrade-to-ruff/).

Rust is coming to us Pythonistas*** whether we like it or not.


#### Footnotes
*Null pointer dereferencing: This occurs when a program tries to access or modify data through a pointer that does not actually point to any valid memory location, often leading to crashes or undefined behavior. Rust prevents this by not allowing null references at all and using the [Option](https://dev.to/taikedz/rusts-option-type-in-python-547p) type instead.

**Data races: This happens when two or more threads access shared data at the same time, and at least one thread modifies the data. Data races can cause unpredictable behavior and are often difficult to debug. Rust’s ownership system ensures that only one thread can access mutable data at a time, preventing data races.

***I have assumed that my audience uses Python. “Pythonista” was another term I learned from PyCon and I was eager to use it.
